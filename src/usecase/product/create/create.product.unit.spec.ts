import CreateProductUseCase from "./create.product.usecase";

const input = {
    type: "a",
    name: "name",
    price: 25.90
}

  const MockRepository = () => {
    return {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
  };

  describe("Unit test create product use case", () => {
    it("should create a product", async () => {
      const productRepository = MockRepository();
      const createProductUseCase = new CreateProductUseCase(productRepository);
  
      const output = await createProductUseCase.execute(input);
  
      expect(output).toEqual({
        id: expect.any(String),
        name: input.name,
        price: input.price
      });
    });
  
    it("should thrown an error when name is missing", async () => {
      const productRepository = MockRepository();
      const createProductUseCase = new CreateProductUseCase(productRepository);
  
      input.name = "";
  
      await expect(createProductUseCase.execute(input)).rejects.toThrow(
        "Name is required"
      );
    });
  
    it("should thrown an error when price is less than zero", async () => {
      const productRepository = MockRepository();
      const createProductUseCase = new CreateProductUseCase(productRepository);
  
      input.name = "name";
      input.price= -1;
  
      await expect(createProductUseCase.execute(input)).rejects.toThrow(
        "Price must be greater than zero"
      );
    });

    it("should thrown an error then type is unknown", async () => {
        const productRepository = MockRepository();
        const createProductUseCase = new CreateProductUseCase(productRepository);
    
        input.name = "name";
        input.price= 35;
        input.type = "c"
    
        await expect(createProductUseCase.execute(input)).rejects.toThrow(
            "Product type not supported"
        );
      });
  });