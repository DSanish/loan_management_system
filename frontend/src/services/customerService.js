import customerApi from "../api/customerApi";

/**
 * ==========================
 * Customer Service
 * ==========================
 */

class CustomerService {

  /**
   * Get All Customers
   */
  async getCustomers(params = {}) {
    try {
      return await customerApi.getCustomers(params);
    } catch (error) {
      console.error("Get Customers Error:", error);

      throw (
        error.response?.data || {
          message: "Unable to fetch customers.",
        }
      );
    }
  }

  /**
   * Get Customer By ID
   */
  async getCustomerById(customerId) {
    try {
      return await customerApi.getCustomerById(customerId);
    } catch (error) {
      console.error("Get Customer Error:", error);

      throw (
        error.response?.data || {
          message: "Unable to fetch customer.",
        }
      );
    }
  }

  /**
   * Create Customer
   */
  async createCustomer(customerData) {
    try {
      return await customerApi.createCustomer(customerData);
    } catch (error) {
      console.error("Create Customer Error:", error);

      throw (
        error.response?.data || {
          message: "Unable to create customer.",
        }
      );
    }
  }

  /**
   * Update Customer
   */
  async updateCustomer(customerId, customerData) {
    try {
      return await customerApi.updateCustomer(
        customerId,
        customerData
      );
    } catch (error) {
      console.error("Update Customer Error:", error);

      throw (
        error.response?.data || {
          message: "Unable to update customer.",
        }
      );
    }
  }

  /**
   * Delete Customer
   */
  async deleteCustomer(customerId) {
    try {
      return await customerApi.deleteCustomer(customerId);
    } catch (error) {
      console.error("Delete Customer Error:", error);

      throw (
        error.response?.data || {
          message: "Unable to delete customer.",
        }
      );
    }
  }

  /**
   * Get Customer Loans
   */
  async getCustomerLoans(customerId) {
    try {
      return await customerApi.getCustomerLoans(customerId);
    } catch (error) {
      console.error("Customer Loans Error:", error);

      throw (
        error.response?.data || {
          message: "Unable to fetch customer loans.",
        }
      );
    }
  }

}

const customerService = new CustomerService();

export default customerService;