import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "./create.product.usecase";
import FindProductUseCase from "../find/find.product.usecase";

describe("Test create product use case", () => {
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
  
    it("should create a product", async () => {
      const productRepository = new ProductRepository();
      const usecase = new CreateProductUseCase(productRepository);
  
      const product = {
        type: "b",
        name: "product name",
        price: 1000,
      };

      const productCreated = await usecase.execute(product);

      const findUseCase = new FindProductUseCase(productRepository);

      const result = await findUseCase.execute({id: productCreated.id});
  
      expect(result).toEqual(productCreated);
      expect(result.price).toEqual(2000);
    });

  });