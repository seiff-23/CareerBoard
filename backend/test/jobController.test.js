const test = require('node:test');
const assert = require('node:assert/strict');
const Job = require('../src/models/Job');
const { updateJob } = require('../src/controllers/jobController');

function response() {
  return { statusCode: 200, body: null,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; } };
}

function database(t) {
  const stored = { _id: 'job-1', user: 'owner', company: 'Acme', status: 'applied' };
  const matches = (filter) => filter._id === stored._id && filter.user === stored.user;
  t.mock.method(Job, 'findOne', async (filter) => matches(filter) ? { ...stored } : null);
  t.mock.method(Job, 'findByIdAndUpdate', async (id, update) => {
    if (id !== stored._id) return null;
    Object.assign(stored, update);
    if (update.$unset) for (const key of Object.keys(update.$unset)) delete stored[key];
    return { ...stored };
  });
  t.mock.method(Job, 'findOneAndUpdate', async (filter, update, options) => {
    if (!matches(filter)) return null;
    assert.equal(options.runValidators, true);
    Object.assign(stored, update.$set);
    return { ...stored };
  });
  return stored;
}

test('updating a status cannot transfer ownership or change immutable metadata', async (t) => {
  const stored = database(t);
  const res = response();
  await updateJob({ user: { _id: 'owner' }, params: { id: 'job-1' },
    body: { status: 'interview', user: 'attacker', _id: 'changed', createdAt: 'changed' } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(stored.status, 'interview');
  assert.equal(stored.user, 'owner');
  assert.equal(stored._id, 'job-1');
  assert.equal(stored.createdAt, undefined);
});

test('MongoDB operators supplied by a client cannot remove ownership', async (t) => {
  const stored = database(t);
  const res = response();
  await updateJob({ user: { _id: 'owner' }, params: { id: 'job-1' },
    body: { notes: 'Follow up', $unset: { user: 1 } } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(stored.user, 'owner');
  assert.equal(stored.notes, 'Follow up');
  assert.equal(stored.$unset, undefined);
});

test('a different user cannot update a candidature', async (t) => {
  const stored = database(t);
  const res = response();
  await updateJob({ user: { _id: 'other-user' }, params: { id: 'job-1' },
    body: { status: 'offer' } }, res);
  assert.equal(res.statusCode, 404);
  assert.equal(stored.status, 'applied');
});
