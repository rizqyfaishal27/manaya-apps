module.exports = function(plop) {

  plop.setGenerator('basics', {
    description: 'Basic generator',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Test message'
      },
      {
        type: 'input',
        name: 'test',
        message: 'reducer name'
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'app/{{name}}.test',
        templateFile: 'plop-templates/test.hbs'
      }
    ]
  })

  plop.setGenerator('second basics', {
    description: 'second basics generator'
  })
};
