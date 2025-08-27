import { listSpecialties } from '../repositories/specialty.repository.js';

export async function listSpecialtiesService() {
  return listSpecialties();
}
