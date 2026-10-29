import cassavaChips from './dried_cassava_chips_closeup.png'
import cassavaDrying from './cassava_chips_drying_racks.png'
import cassavaFarm from './cassava_farm_field.png'
import cassavaRoots from './fresh_cassava_roots_in_soil.png'
import copperMine from './copper_01.jpg.jpeg'
import copperTruck from './copper_02.jpg.jpeg'
import copperOre from './copper_03.jpg.jpeg'
import copperProcessing from './copper_04.jpg.jpeg'
import copperSmelting from './copper_05.jpg.jpeg'
import copperSheets from './copper_08.jpg.jpeg'
import copperShipping from './copper_07.jpg.jpeg'
import copperPlate from './copper_08.jpg.jpeg'
import lithiumMine from './lithium_01.jpg.jpeg'
import lithiumEquipment from './lithium_02.jpg.jpeg'
import lithiumMineral from './lithium_03.jpg.jpeg'
import lithiumProcessing from './lithium_04.jpg.jpeg'
import lithiumRefining from './lithium_05.jpg.jpeg'
import lithiumConcentrate from './lithium_06.jpg.jpeg'
import lithiumWorker from './lithium_07.jpg.jpeg'
import cassavaHarvest from './harvested_cassava_roots.png'
import cassavaPeeling from './peeled_cassava_tubers.png'
import cassavaLeaves from './cassava_plant_closeup.png'

export const commodityImages = {
  lithium: {
    card: lithiumEquipment,
    catalog: lithiumMineral,
    detail: lithiumMine,
    processing: lithiumProcessing,
    refining: lithiumRefining,
    concentrate: lithiumConcentrate,
    operations: lithiumWorker,
    gallery: [
      { image: lithiumMineral, caption: 'Lithium-bearing mineral' },
      { image: lithiumEquipment, caption: 'Mining and material handling' },
      { image: lithiumConcentrate, caption: 'Lithium concentrate' },
      { image: lithiumProcessing, caption: 'Mineral processing facility' },
      { image: lithiumWorker, caption: 'Mineral inspection' },
    ],
  },
  copper: {
    card: copperOre,
    catalog: copperSheets,
    detail: copperTruck,
    processing: copperProcessing,
    operations: copperShipping,
    smelting: copperSmelting,
    mine: copperMine,
    gallery: [
      { image: copperMine, caption: 'Copper mining operations' },
      { image: copperOre, caption: 'Copper-bearing ore' },
      { image: copperProcessing, caption: 'Copper ore processing' },
      { image: copperSmelting, caption: 'Copper smelting' },
      { image: copperPlate, caption: 'Finished copper products' },
    ],
  },
  cassava: {
    card: cassavaFarm,
    catalog: cassavaRoots,
    detail: cassavaChips,
    processing: cassavaDrying,
    harvest: cassavaHarvest,
    prepared: cassavaPeeling,
    crop: cassavaLeaves,
    gallery: [
      { image: cassavaFarm, caption: 'Cassava cultivation' },
      { image: cassavaHarvest, caption: 'Harvested cassava roots' },
      { image: cassavaPeeling, caption: 'Prepared cassava tubers' },
      { image: cassavaDrying, caption: 'Cassava chip drying' },
      { image: cassavaChips, caption: 'Dried cassava chips' },
    ],
  },
}
