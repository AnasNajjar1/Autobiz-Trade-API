// import { InMemoryBrandRepo } from './implementations/inMemoryBrandRepo';
// const brandRepo = new InMemoryBrandRepo();

import { AutobizApiBrandRepo } from './implementations/autobizApiBrandRepo';
const brandRepo = new AutobizApiBrandRepo();

// import { InMemoryModelRepo } from './implementations/inMemoryModelRepo';
// const modelRepo = new InMemoryModelRepo();

import { AutobizApiModelRepo } from './implementations/autobizApiModelRepo';
const modelRepo = new AutobizApiModelRepo();

export { brandRepo, modelRepo };
