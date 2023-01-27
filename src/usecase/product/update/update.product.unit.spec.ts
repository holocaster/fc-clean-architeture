import ProductFactory from "../../../domain/product/factory/product.factory";
import UpdateProductUseCase from "./update.product.usecase";

const product = ProductFactory.create("a", "product 1", 30);

const input = {
    id: product.id,
    name: "product Updated",
    price: product.price
  };


const mockRepository = () => {
    return {
        create: jest.fn(),
        findAll: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        update: jest.fn(),
    }
  };

  describe("Unit test for product update use case", () => {
    it("should update a product", async () => {
      const productRepository = mockRepository();
      const updateProductUseCase = new UpdateProductUseCase(productRepository);
  
      const output = await updateProductUseCase.execute(input);
  
      expect(output).toEqual(input);
    });

    it("should thrown an error when name is missing", async () => {
        const productRepository = mockRepository();
        const updateProductUseCase = new UpdateProductUseCase(productRepository);
    
        input.name = "";
    
        await expect(updateProductUseCase.execute(input)).rejects.toThrow(
          "Name is required"
        );
      });

      it("should thrown an error when price is less than zero", async () => {
        const productRepository = mockRepository();
        const updateProductUseCase = new UpdateProductUseCase(productRepository);
    
        input.name = "Product Updated"
        input.price = -1
    
        await expect(updateProductUseCase.execute(input)).rejects.toThrow(
            "Price must be greater than zero"
        );
      });
  });