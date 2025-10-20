import { DataSource } from 'typeorm';
import { CustomerAddress } from 'src/core/database/entities/customer_address.entity';

export const customer_addressProviders = [
  {
    provide: 'CUSTOMER_ADDRESS_REPOSITORY', // deve bater com @Inject no service
    useFactory: (dataSource: DataSource) => dataSource.getRepository(CustomerAddress),
    inject: ['DATA_SOURCE'],
  },
];
