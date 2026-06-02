import { SaveBlockDTO, SaveConnectionDTO } from "../../../shared/dto/DigitalTwin/digitalTwin.dto";
import {
  DigitalTwinRepository,
} from "../../repositories/DigitalTwin/DigitalTwinRepository";

export class SaveDiagramUseCase {
  constructor(private repository: DigitalTwinRepository) {}

  async execute(
    setorId: string,
    blocks: SaveBlockDTO[],
    connections: SaveConnectionDTO[],
  ) {
    if (!setorId)
      throw new Error("O ID do setor é obrigatório para salvar o diagrama.");

    return await this.repository.saveDiagram(setorId, blocks, connections);
  }
}
