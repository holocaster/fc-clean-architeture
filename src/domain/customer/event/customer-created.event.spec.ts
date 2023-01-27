

import EventDispatcher from "../../@shared/event/event.dispatcher";
import Address from "../value-object/address";
import Customer from "../entity/customer";
import CustomerCreatedEvent from "./customer-created.event";
import SendConsoleLog1WhenCustomerIsCreated from "./handler/send-console-log1-customer-created.handler";
import SendConsoleLog2WhenCustomerIsCreated from "./handler/send-console-log2-customer-created.handler";

describe("Customer created events tests", () => {
    it("should register an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendConsoleLog1WhenCustomerIsCreated();
        const eventHandler2 = new SendConsoleLog2WhenCustomerIsCreated();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2);
    });

    it("should unregister an event", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendConsoleLog1WhenCustomerIsCreated();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregister("CustomerCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(0);
    });

    it("should notify all event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandlerLog1 = new SendConsoleLog1WhenCustomerIsCreated();
        const eventHandlerLog2 = new SendConsoleLog2WhenCustomerIsCreated();
        const spyEventHandler1 = jest.spyOn(eventHandlerLog1, "handle");
        const spyEventHandler2 = jest.spyOn(eventHandlerLog2, "handle");

        eventDispatcher.register("CustomerCreatedEvent", eventHandlerLog1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandlerLog2);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandlerLog1);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandlerLog2);

        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.address = address;
        const customerCreatedEvent = new CustomerCreatedEvent(customer);

        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEventHandler1).toHaveBeenCalled();
        expect(spyEventHandler2).toHaveBeenCalled();
    });
});