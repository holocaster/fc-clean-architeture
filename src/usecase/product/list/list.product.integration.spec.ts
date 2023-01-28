import { Sequelize } from "sequelize-typescript";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductUseCase from "./list.product.usecase";

describe("Test list product use case", () => {
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

    it("should list products", async () => {
        const productRepository = new ProductRepository();
        const usecase = new ListProductUseCase(productRepository);

        const product1 = ProductFactory.create("b", "productb", 25);
        const product2 = ProductFactory.create("a", "producta", 25);

        await productRepository.create(product1);
        await productRepository.create(product2);

        const result = await usecase.execute({});

        expect(result.products).toHaveLength(2);
        expect(result.products).toContainEqual({
            id: product1.id,
            name: product1.name,
            price: product1.price
        })
        expect(result.products).toContainEqual({
            id: product2.id,
            name: product2.name,
            price: product2.price
        });
    });
});