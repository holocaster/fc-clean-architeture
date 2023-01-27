import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import UpdateCustomerUseCase from "./update.customer.usecase";

const customer = CustomerFactory.createWithAddress(
    "John",
    new Address("Street", 123, "Zip", "City")
  );
  
  const input = {
    id: customer.id,
    name: "John Updated",
    address: {
      street: "Street Updated",
      number: 1234,
      zip: "Zip Updated",
      city: "City Updated",
    },
  };

  const mockRepository = () => {
    return {
        create: jest.fn(),
        findAll: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(customer)),
        update: jest.fn(),
    }
  };

  describe("Unit test for customer update use case", () => {
    it("should update a customer", async () => {
      const customerRepository = mockRepository();
      const customerUpdateUseCase = new UpdateCustomerUseCase(customerRepository);
  
      const output = await customerUpdateUseCase.execute(input);
  
      expect(output).toEqual(input);
    });

    it("should thrown an error when name is missing", async () => {
        const customerRepository = mockRepository();
        const createCustomerUseCase = new UpdateCustomerUseCase(customerRepository);
    
        input.name = "";
    
        await expect(createCustomerUseCase.execute(input)).rejects.toThrow(
          "Name is required"
        );
      });

      it("should thrown an error when street is missing", async () => {
        const customerRepository = mockRepository();
        const createCustomerUseCase = new UpdateCustomerUseCase(customerRepository);
    
        input.name = "John Updated"
        input.address.street = "";
    
        await expect(createCustomerUseCase.execute(input)).rejects.toThrow(
          "Street is required"
        );
      });
  });