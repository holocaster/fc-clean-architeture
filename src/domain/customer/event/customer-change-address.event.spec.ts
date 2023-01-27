
import EventDispatcher from "../../@shared/event/event.dispatcher";
import Address from "../value-object/address";
import Customer from "../entity/customer";
import CustomerChangeAddressEvent from "./customer-change-address.event";
import SendConsoleLogWhenCustomerChangeAddress from "./handler/send-console-log-customer-change-address.handler";

describe("Customer change address events tests", () => {
    it("should register an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendConsoleLogWhenCustomerChangeAddress();

        eventDispatcher.register("CustomerChangeAddressEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"][0]).toMatchObject(eventHandler);
    });

    it("should unregister an event", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendConsoleLogWhenCustomerChangeAddress();

        eventDispatcher.register("CustomerChangeAddressEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregister("CustomerChangeAddressEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"].length).toBe(0);
    });

    it("should notify all event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandlerLog1 = new SendConsoleLogWhenCustomerChangeAddress();
        const spyEventHandler1 = jest.spyOn(eventHandlerLog1, "handle");

        eventDispatcher.register("CustomerChangeAddressEvent", eventHandlerLog1);

        expect(eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"][0]).toMatchObject(eventHandlerLog1);

        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.address = address;
        const customerChangeAddressEvent = new CustomerChangeAddressEvent(customer);

        eventDispatcher.notify(customerChangeAddressEvent);

        expect(spyEventHandler1).toHaveBeenCalled();
    });
});