const Employee = require('../models/Employee');

const employeeResolvers = {
  Query: {
    getAllEmployees: async () => await Employee.find(),
    getEmployeeById: async (_, { id }) => await Employee.findById(id),
    searchEmployees: async (_, { designation, department }) => await Employee.find({ $or: [{ designation }, { department }] }),
  },
  Mutation: {
    addEmployee: async (_, args) => {
      const newEmployee = new Employee(args);
      await newEmployee.save();
      return newEmployee;
    },
    updateEmployee: async (_, { id, ...args }) => await Employee.findByIdAndUpdate(id, args, { new: true }),
    deleteEmployee: async (_, { id }) => {
      await Employee.findByIdAndDelete(id);
      return "Employee deleted successfully";
    },
  }
};

module.exports = employeeResolvers;