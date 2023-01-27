
import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "../create/create.product.usecase";
import UpdateProductUseCase from "./update.product.usecase";

describe("Test update product use case", () => {
    let sequelize: Sequelize;
  
    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
      });
  
      await sequelize.addModels([ProductModel]);
      await sequelize.sync();
    });
  
    afterEach(async () => {
      await sequelize.close();
    });
  
    it("should update a product", async () => {
      const productRepository = new ProductRepository();
      const createUseCase = new CreateProductUseCase(productRepository);
  
      const product = {
        type: "b",
        name: "product name",
        price: 1000,
      };

      const productCreated = await createUseCase.execute(product);

      const updateUseCase = new UpdateProductUseCase(productRepository);

      const productUpdate = {
        id: productCreated.id,
        name: "Updated name",
        price: 3500
      }

      const result = await updateUseCase.execute(productUpdate);
  
      expect(result.name).toEqual(productUpdate.name)
      expect(result.price).toEqual(productUpdate.price);
    });

  });