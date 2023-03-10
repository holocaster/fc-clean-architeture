
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Address from "../../../../domain/customer/value-object/address";
import Customer from "../../../../domain/customer/entity/customer";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import OrderItemModel from "./ordem.item.model";
import OrderModel from "./order.model";
import ProductModel from "../../../product/repository/sequelize/product.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderRepository from "./order.repository";
import { Sequelize } from "sequelize-typescript";


describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const ordemItem = new OrderItem("1",product.name,product.price,product.id,2);
    const order = new Order("123", "123", [ordemItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: ordemItem.id,
          name: ordemItem.name,
          price: ordemItem.price,
          quantity: ordemItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should find a order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const ordemItem = new OrderItem("1",product.name,product.price,product.id,2);
    const order = new Order("123", "123", [ordemItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderResult = await orderRepository.find(order.id);

    expect(order).toStrictEqual(orderResult);
  });

  it("should throw an error when order is not found", async () => {

    const orderRepository = new OrderRepository();

    expect(async () => {
      await orderRepository.find("challenge");
    }).rejects.toThrow("Order not found");
  });

  it("should final all orders", async () => {
    const orderRepository = new OrderRepository();
    let orders = await orderRepository.findAll();
    expect(orders).toHaveLength(0);


    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 1", 10);
    await productRepository.create(product);

    const product2 = new Product("2", "Product 2", 15);
    await productRepository.create(product2);

    const ordemItem = new OrderItem("1",product.name,product.price,product.id,2);
    const ordemItem2 = new OrderItem("2",product2.name,product2.price,product2.id,5);

    const order = new Order("1", "123", [ordemItem]);
    const order2 = new Order("2", "123", [ordemItem2]);
    await orderRepository.create(order);
    await orderRepository.create(order2);

    orders = await orderRepository.findAll();

    expect(orders).toHaveLength(2);
    expect(orders).toContainEqual(order);
    expect(orders).toContainEqual(order2);

  });

  it("should update a order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 1", 10);
    await productRepository.create(product);

    const ordemItem = new OrderItem("1",product.name,product.price,product.id,2);
    const order = new Order("1", "123", [ordemItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const product2 = new Product("2", "Product 2", 20);
    await productRepository.create(product2);
    const ordemItem2 = new OrderItem("2",product2.name,product2.price,product2.id,2);

    order.addOrdemItem(ordemItem2);
    await orderRepository.update(order);

    const orderModel = await OrderModel.findOne({where : {id : "1"}, include: [{ model: OrderItemModel }], });

    expect(orderModel).toBeDefined();
    expect(orderModel.toJSON()).toStrictEqual({
      id: "1",
      customer_id: customer.id,
      total: 60,
      items: [
        {
          id: ordemItem.id,
          name: ordemItem.name,
          price: ordemItem.price,
          quantity: 2,
          order_id: "1",
          product_id: "1",
        },
        {
          id: ordemItem2.id,
          name: ordemItem2.name,
          price: ordemItem2.price,
          quantity: 2,
          order_id: "1",
          product_id: "2",
        },
      ], 
    });
  });
});