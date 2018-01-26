module.exports = app => {
	const TaskTC = app.models.tasks
	const UserTC = app.models.users
  TaskTC.addRelation('user', {
    resolver: () => UserTC.getResolver('findById'),
    prepareArgs: {
      _id: source => source.user.id
    },
    projection: {
      user: true
    }
  });
};
