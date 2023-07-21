require('dotenv').config()

const mongoose = require('mongoose');
const Employee = require('./models/Employee.model');
const Virus = require('./models/Virus.model');

const employees = [
    {
        number: "4040",
        password:"1111",
        level: "1",
        position: "Junior Researcher",
       },
  ];

  const viruses = [
    {
      name: "COVID-19",
      image: "covid.gif",
      info: `Severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) is a novel severe acute respiratory syndrome 
      coronavirus. It was first isolated from three people with pneumonia connected to the cluster of acute respiratory illness cases in Wuhan. 
      All structural features of the novel SARS-CoV-2 virus particle occur in related coronaviruses in nature,
      particularly in Rhinolophus sinicus aka Chinese horseshoe bats. 
      Outside the human body, the virus is destroyed by household soap which bursts its protective bubble. Hospital disinfectants, alcohols, 
      heat, povidone-iodine, and ultraviolet-C (UV-C) irradiation are also effective disinfection methods for surfaces.
      SARS-CoV-2 is closely related to the original SARS-CoV. Genetic analysis has revealed that the coronavirus genetically clusters with the 
      genus Betacoronavirus, in subgenus Sarbecovirus (lineage B) together with two bat-derived strains. It is 96% identical at the whole 
      genome level to other bat coronavirus samples (BatCov RaTG13). The structural proteins of SARS-CoV-2 include membrane glycoprotein (M), 
      envelope protein (E), nucleocapsid protein (N), and the spike protein (S). The M protein of SARS-CoV-2 is about 98% similar to the M protein 
      of bat SARS-CoV, maintains around 98% homology with pangolin SARS-CoV, and has 90% homology with the M protein of SARS-CoV; whereas, the 
      similarity is only around 38% with the M protein of MERS-CoV.`,
     },
       {
        name: "T-Virus",
        image: "tvirus.gif",
        info:`Like any other virus, t-Viruses make contact with a cell's membrane and insert their genetic coding into the cell. 
        The viral genome is absorbed into the cell, hijacking its intended functions and using them to produce virions similar to the original 
        virus. The newly formed virions are then released from the host cell and infect neighboring cells, initiating the process once again.
        Several diseases have been associated with t-Virus infection. The first, tentatively referred to as "Progenitor disease," is a fatal 
        viral illness caused by Progenitor and early t-Virus strains. The exact mechanism of this disease is unknown, including whether it 
        triggers a cytokine storm or rapidly mutates the patient until death. However, the most common disease caused by t-Viruses is 
        Cannibal Disease, a condition in which patients mutate to gain enhanced survival capabilities at the cost of brain damage and 
        homicidal urges. Advanced-stage Cannibal Disease patients are referred to as "Zombies," while pre-symptomatic and early-symptomatic 
        cases can be treated with antiretroviral drugs. In the ε strain and its variants, Zombies undergo various mutations over time, 
        such as becoming Crimson Heads, Lickers, the Suspended, or Pale Heads.
        `,
       },
    {
        name: "G-Virus",
        image: "gvirus.gif",
        info:`Vials containing t-virus and G-virus samples.The G-virus, shown as a purple, aqueous liquid in a glass vial in, greatly increases 
        the host's metabolism, accelerating cellular duplication and revitalization of dead cells at the cost of higher brain function by 
        continual destruction of mitochondria in neurons, causing the infected person to degrade to sub-human levels. The host exhibits 
        animalistic behavior, loss of moral reasoning and memory, and becomes driven by self-preservation. Ultimately, carriers become 
        creatures simply dubbed G. Infection by the G-virus is caused by injection or ingestion of the virus, but unlike creatures infected 
        with the t-virus, G-mutants cannot pass infection on to other creatures through physical contact or injury. Instead, they create 
        offspring by orally implanting small, parasitic organisms into a live host through the palm of the hand, in the case of William Birkin. 
        In unfortunate cases, a host who has no compatible DNA match will reject the parasite in a matter of hours or less. 
        The embryo rapidly grows inside its host before bursting from their chest (a homage to the Alien movie series). 
        Upon exiting the host body, the embryo quickly mutates into its adult form.`,
       },
  ];

mongoose
  .connect(process.env.MONGODB_URI)
  .then(x => {
    console.log(`Seed.js connected to Mongo database: "${x.connections.name}"`);
    return Employee.create(employees);
  })
  .then(employeesFromDB => {
    console.log(`Created ${employeesFromDB.length} employees`);
    return mongoose.connection.close();
  })
  .then(() => {
    console.log('DB connection closed!');
  })
  .catch(err => {
    console.log(`An error occurred while creating emloyees from the DB: ${err}`);
  });

// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(x => {
//     console.log(`Seed.js connected to Mongo database: "${x.connections.name}"`);
//     return Virus.create(viruses);
//   })
//   .then(virusesFromDB => {
//     console.log(`Created ${virusesFromDB.length} viruses`);
//     return mongoose.connection.close();
//   })
//   .then(() => {
//     console.log('DB connection closed!');
//   })
//   .catch(err => {
//     console.log(`An error occurred while creating viruses from the DB: ${err}`);
//   });