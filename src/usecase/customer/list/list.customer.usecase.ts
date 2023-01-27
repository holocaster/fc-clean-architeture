import { InputListCustomerDTO, OutputListCustomerDTO } from './list.customer.dto';
import CustomerRepositoryInterface from "../../../domain/customer/repository/customer-repository.interface";
import Customer from '../../../domain/customer/entity/customer';


export class ListCustomerUseCase {
    private customerRepository: CustomerRepositoryInterface;

    constructor(customerRepository: CustomerRepositoryInterface) {
        this.customerRepository = customerRepository;
    }

    async execute(input: InputListCustomerDTO): Promise<OutputListCustomerDTO> {
        const customers = await this.customerRepository.findAll();
        return OutputMapper.toOutput(customers)
    }


}

class OutputMapper {
    static toOutput(customer: Customer[]): OutputListCustomerDTO {
        return {
            customers: customer.map((customer) => ({
                id: customer.id,
                name: customer.name,
                address: {
                    street: customer.address.street,
                    number: customer.address.number,
                    zip: customer.address.zip,
                    city: customer.address.city,
                },
            })),
        };
    }
}