export const pets = [
    {
      id: 1,
      name: 'LAYZA',
      image: '../../public/Layza.png',
      priority: 'baja',
      sex: 'hembra',
      breed: 'mestizo',
      description: 'naranja y chiquita',
      admissionDate: '2025-12-07',
      admissionBy: 'Florencia Rodríguez',
      temperament: 'Cariñosa',
      socialization: 'Se lleva bien con otros perros',
      observations: 'Le gusta dormir',
      location: 'En el refugio',
      currentState: 'en el refugio',
      caregiver: 'Amelia',
      lastUpdates: [
        {
          date: '13/5/2025',
          by: 'Dr Manuel',
          report:
            'Se colocó vacuna de la sarna, realizar 2 dosis más 1 vez por semana',
        },
      ],
      history: [
        {
          label: 'Vacunas aplicadas',
          records: [
            { date: '01/03/2025', vaccine: 'Moquillo', dose: '1 ml', next: '01/04/2025' },
            { date: '15/03/2025', vaccine: 'Parvovirus', dose: '1 ml', next: '15/04/2025' },
          ],
        },
        {
          label: 'Desparasitaciones',
          records: [
            { date: '10/02/2025', product: 'Milbemicina oxima', route: 'oral', next: '10/03/2025' },
            { date: '10/04/2025', product: 'Praziquantel', route: 'oral', next: '10/05/2025' },
          ],
        },
        {
          label: 'Estudios y análisis realizados',
          records: [
            { date: '20/01/2025', type: 'Hemograma completo', result: 'Normal' },
            { date: '05/02/2025', type: 'Ecografía abdominal', result: 'Sin hallazgos' },
          ],
        },
      ],
      age: 3,
    },
    {
      id: 2,
      name: 'BRUNO',
      image: './../public/Batman.png',
      priority: 'alta',
      sex: 'macho',
      breed: 'labrador',
      description: 'negro y muy activo',
      admissionDate: '2025-11-15',
      admissionBy: 'Dr. Pérez',
      temperament: 'Juguetón',
      socialization: 'Le encanta jugar con humanos',
      observations: 'Requiere entrenamiento básico',
      location: 'En adopción',
      currentState: 'en proceso de adopción',
      caregiver: 'Carlos',
      lastUpdates: [
        { date: '10/05/2025', by: 'Dr Pérez', report: 'Revacuna de moquillo completada' },
      ],
      history: [
        {
          label: 'Vacunas aplicadas',
          records: [
            { date: '10/11/2025', vaccine: 'Rabia', dose: '1 ml', next: '10/11/2026' },
          ],
        },
        {
          label: 'Desparasitaciones',
          records: [
            { date: '05/12/2025', product: 'Ivermectina', route: 'oral', next: '05/01/2026' },
          ],
        },
        {
          label: 'Estudios y análisis realizados',
          records: [
            { date: '12/12/2025', type: 'Profilaxis dental', result: 'Sin sarro' },
          ],
        },
      ],
      age: 6,
    },
    {
      id: 3,
      name: 'LUNA',
      image: './../public/Mauricio.png',
      priority: 'media',
      sex: 'hembra',
      breed: 'pastor alemán',
      description: 'juguetona y protectora',
      admissionDate: '2025-10-20',
      admissionBy: 'Dra. Gómez',
      temperament: 'Protector',
      socialization: 'Buena con familias',
      observations: 'Necesita espacio amplio',
      location: 'En cuarentena',
      currentState: 'en tratamiento',
      caregiver: 'María',
      lastUpdates: [
        { date: '05/05/2025', by: 'Dra. Gómez', report: 'Chequeo general sin incidencias' },
      ],
      history: [
        {
          label: 'Vacunas aplicadas',
          records: [
            { date: '20/10/2025', vaccine: 'Cimurghillo', dose: '1 ml', next: '20/11/2025' },
          ],
        },
        {
          label: 'Desparasitaciones',
          records: [
            { date: '22/11/2025', product: 'Fenbendazol', route: 'oral', next: '22/12/2025' },
          ],
        },
        {
          label: 'Estudios y análisis realizados',
          records: [
            { date: '25/11/2025', type: 'Radiografía tórax', result: 'Corazón normal' },
          ],
        },
      ],
      age: 4,
    },
    {
      id: 4,
      name: 'BELLA',
      image: './../public/bella.png',
      priority: 'alta',
      sex: 'hembra',
      breed: 'golden retriever',
      description: 'adorable y amistosa',
      admissionDate: '2025-09-01',
      admissionBy: 'Dra. Martínez',
      temperament: 'Alegre',
      socialization: 'Muy sociable con niños',
      observations: 'Le encanta nadar',
      location: 'En adopción',
      currentState: 'en proceso de adopción',
      caregiver: 'Lucía',
      lastUpdates: [
        {
          date: '12/05/2025',
          by: 'Dra. Martínez',
          report: 'Chequeo general y vacuna antiparásitos',
        },
      ],
      history: [
        {
          label: 'Vacunas aplicadas',
          records: [
            { date: '01/09/2025', vaccine: 'Rabia', dose: '1 ml', next: '01/09/2026' },
          ],
        },
        {
          label: 'Desparasitaciones',
          records: [
            { date: '05/09/2025', product: 'Ivermectina', route: 'oral', next: '05/10/2025' },
          ],
        },
        {
          label: 'Estudios y análisis realizados',
          records: [
            { date: '10/09/2025', type: 'Hemograma', result: 'Normal' },
          ],
        },
      ],
      age: 2,
    },
    {
      id: 5,
      name: 'CHARLIE',
      image: './../public/charlie.png',
      priority: 'media',
      sex: 'macho',
      breed: 'beagle',
      description: 'curioso y enérgico',
      admissionDate: '2025-08-20',
      admissionBy: 'Dr. Pérez',
      temperament: 'Explorador',
      socialization: 'Le gustan los paseos en grupo',
      observations: 'Tiende a cavar hoyos',
      location: 'En refugio',
      currentState: 'herido',
      caregiver: 'Marisol',
      lastUpdates: [
        {
          date: '15/05/2025',
          by: 'Dr. Pérez',
          report: 'Revisión dental y corte de uñas',
        },
      ],
      history: [
        {
          label: 'Vacunas aplicadas',
          records: [
            { date: '20/08/2025', vaccine: 'Parvovirus', dose: '1 ml', next: '20/09/2025' },
          ],
        },
        {
          label: 'Desparasitaciones',
          records: [
            { date: '25/08/2025', product: 'Praziquantel', route: 'oral', next: '25/09/2025' },
          ],
        },
        {
          label: 'Estudios y análisis realizados',
          records: [
            { date: '30/08/2025', type: 'Perfil bioquímico', result: 'Dentro de parámetros' },
          ],
        },
      ],
      age: 5,
    },
    {
      id: 6,
      name: 'ROCKY',
      image: './../public/rocky.png',
      priority: 'alta',
      sex: 'macho',
      breed: 'pastor belga malinois',
      description: 'leal y protector',
      admissionDate: '2025-07-10',
      admissionBy: 'Dra. Gómez',
      temperament: 'Vigilante',
      socialization: 'Reservado con extraños',
      observations: 'Necesita entrenamiento diario',
      location: 'Cuidados especiales',
      currentState: 'en tratamiento',
      caregiver: 'Esteban',
      lastUpdates: [
        {
          date: '18/05/2025',
          by: 'Dra. Gómez',
          report: 'Control de movilidad articular',
        },
      ],
      history: [
        {
          label: 'Vacunas aplicadas',
          records: [
            { date: '10/07/2025', vaccine: 'Moquillo', dose: '1 ml', next: '10/08/2025' },
          ],
        },
        {
          label: 'Desparasitaciones',
          records: [
            { date: '15/07/2025', product: 'Milbemicina', route: 'oral', next: '15/08/2025' },
          ],
        },
        {
          label: 'Estudios y análisis realizados',
          records: [
            { date: '20/07/2025', type: 'Radiografía de cadera', result: 'Ligera displasia' },
          ],
        },
      ],
      age: 7,
    },
    {
      id: 7,
      name: 'COCO',
      image: './../public/coco.png',
      priority: 'baja',
      sex: 'macho',
      breed: 'poodle',
      description: 'suave y juguetón',
      admissionDate: '2025-06-05',
      admissionBy: 'Dr. Navarro',
      temperament: 'Cariñoso',
      socialization: 'Ideal para familias',
      observations: 'Requiere cepillado diario',
      location: 'En adopción',
      currentState: 'saludable',
      caregiver: 'Ana',
      lastUpdates: [
        {
          date: '10/05/2025',
          by: 'Dr. Navarro',
          report: 'Corte de pelo y revisión de piel',
        },
      ],
      history: [
        {
          label: 'Vacunas aplicadas',
          records: [
            { date: '05/06/2025', vaccine: 'Rabia', dose: '1 ml', next: '05/06/2026' },
          ],
        },
        {
          label: 'Desparasitaciones',
          records: [
            { date: '12/06/2025', product: 'Fenbendazol', route: 'oral', next: '12/07/2025' },
          ],
        },
        {
          label: 'Estudios y análisis realizados',
          records: [
            { date: '15/06/2025', type: 'Ultrasonido abdominal', result: 'Normal' },
          ],
        },
      ],
      age: 1,
    },
    {
      id: 8,
      name: 'DAISY',
      image: './../public/daisy.png',
      priority: 'media',
      sex: 'hembra',
      breed: 'bulldog francés',
      description: 'tranquila y sociable',
      admissionDate: '2025-05-12',
      admissionBy: 'Dra. Ruiz',
      temperament: 'Apacible',
      socialization: 'Se lleva bien con gatos',
      observations: 'Puede ser un poco obstinada',
      location: 'Refugio principal',
      currentState: 'enfermo',
      caregiver: 'Olivia',
      lastUpdates: [
        {
          date: '12/05/2025',
          by: 'Dra. Ruiz',
          report: 'Revisión de oídos y ojos',
        },
      ],
      history: [
        {
          label: 'Vacunas aplicadas',
          records: [
            { date: '12/05/2025', vaccine: 'Parvovirus', dose: '1 ml', next: '12/06/2025' },
          ],
        },
        {
          label: 'Desparasitaciones',
          records: [
            { date: '18/05/2025', product: 'Ivermectina', route: 'oral', next: '18/06/2025' },
          ],
        },
        {
          label: 'Estudios y análisis realizados',
          records: [
            { date: '20/05/2025', type: 'Examen fecal', result: 'Sin parásitos' },
          ],
        },
      ],
      age: 4,
    },
    {
      id: 9,
      name: 'MILO',
      image: './../public/milo.png',
      priority: 'alta',
      sex: 'macho',
      breed: 'shih tzu',
      description: 'pequeño y valiente',
      admissionDate: '2025-04-22',
      admissionBy: 'Dr. Fernández',
      temperament: 'Enérgico',
      socialization: 'Le gusta subirse al regazo',
      observations: 'Necesita dieta hipocalórica',
      location: 'Consulta nutrición',
      currentState: 'en tratamiento',
      caregiver: 'Pablo',
      lastUpdates: [
        {
          date: '22/05/2025',
          by: 'Dr. Fernández',
          report: 'Inició plan de dieta',
        },
      ],
      history: [
        {
          label: 'Vacunas aplicadas',
          records: [
            { date: '22/04/2025', vaccine: 'Moquillo', dose: '1 ml', next: '22/05/2025' },
          ],
        },
        {
          label: 'Desparasitaciones',
          records: [
            { date: '28/04/2025', product: 'Praziquantel', route: 'oral', next: '28/05/2025' },
          ],
        },
        {
          label: 'Estudios y análisis realizados',
          records: [
            { date: '30/04/2025', type: 'Perfil lipídico', result: 'Colesterol alto' },
          ],
        },
      ],
      age: 3,
    },
    {
      id: 10,
      name: 'LOLA',
      image: './../public/lola.png',
      priority: 'baja',
      sex: 'hembra',
      breed: 'cocker spaniel',
      description: 'dulce y obediente',
      admissionDate: '2025-03-30',
      admissionBy: 'Dra. Herrera',
      temperament: 'Suave',
      socialization: 'Perfecta para departamentos',
      observations: 'Le gusta estar en brazos',
      location: 'En adopción',
      currentState: 'en el refugio',
      caregiver: 'Sara',
      lastUpdates: [
        {
          date: '30/04/2025',
          by: 'Dra. Herrera',
          report: 'Vacuna antipulgas aplicada',
        },
      ],
      history: [
        {
          label: 'Vacunas aplicadas',
          records: [
            { date: '30/03/2025', vaccine: 'Rabia', dose: '1 ml', next: '30/03/2026' },
          ],
        },
        {
          label: 'Desparasitaciones',
          records: [
            { date: '05/04/2025', product: 'Milbemicina', route: 'oral', next: '05/05/2025' },
          ],
        },
        {
          label: 'Estudios y análisis realizados',
          records: [
            { date: '10/04/2025', type: 'Examen cardiológico', result: 'Normal' },
          ],
        },
      ],
      age: 5,
    },
    {
      id: 11,
      name: 'REX',
      image: './../public/rex.png',
      priority: 'alta',
      sex: 'macho',
      breed: 'doberman',
      description: 'fuerte y obediente',
      admissionDate: '2025-02-14',
      admissionBy: 'Dr. Morales',
      temperament: 'Dominante',
      socialization: 'Requiere socialización temprana',
      observations: 'Protector con otros perros',
      location: 'Entrenamiento',
      currentState: 'en adopción',
      caregiver: 'Héctor',
      lastUpdates: [
        {
          date: '14/05/2025',
          by: 'Dr. Morales',
          report: 'Evaluación de fuerza muscular',
        },
      ],
      history: [
        {
          label: 'Vacunas aplicadas',
          records: [
            { date: '14/02/2025', vaccine: 'Parvovirus', dose: '1 ml', next: '14/03/2025' },
          ],
        },
        {
          label: 'Desparasitaciones',
          records: [
            { date: '20/02/2025', product: 'Fenbendazol', route: 'oral', next: '20/03/2025' },
          ],
        },
        {
          label: 'Estudios y análisis realizados',
          records: [
            { date: '25/02/2025', type: 'Prueba de esfuerzo', result: 'Excelente' },
          ],
        },
      ],
      age: 6,
    },
    {
      id: 12,
      name: 'KIRA',
      image: './../public/kira.png',
      priority: 'media',
      sex: 'hembra',
      breed: 'husky siberiano',
      description: 'energética y amigable',
      admissionDate: '2025-01-20',
      admissionBy: 'Dra. Soto',
      temperament: 'Juguetona',
      socialization: 'Ama el frío',
      observations: 'Requiere ejercicio diario',
      location: 'Patio exterior',
      currentState: 'enfermo',
      caregiver: 'Patricia',
      lastUpdates: [
        {
          date: '20/05/2025',
          by: 'Dra. Soto',
          report: 'Chequeo de articulaciones',
        },
      ],
      history: [
        {
          label: 'Vacunas aplicadas',
          records: [
            { date: '20/01/2025', vaccine: 'Moquillo', dose: '1 ml', next: '20/02/2025' },
          ],
        },
        {
          label: 'Desparasitaciones',
          records: [
            { date: '25/01/2025', product: 'Ivermectina', route: 'oral', next: '25/02/2025' },
          ],
        },
        {
          label: 'Estudios y análisis realizados',
          records: [
            { date: '30/01/2025', type: 'Análisis de tiroides', result: 'Normal' },
          ],
        },
      ],
      age: 3,
    },
    {
      id: 13,
      name: 'SIMBA',
      image: './../public/simba.png',
      priority: 'alta',
      sex: 'macho',
      breed: 'mastín napolitano',
      description: 'imponente y sereno',
      admissionDate: '2024-12-05',
      admissionBy: 'Dr. Ruiz',
      temperament: 'Tranquilo',
      socialization: 'Se adapta fácil a nuevos entornos',
      observations: 'Requiere control de peso',
      location: 'En adopción',
      currentState: 'herido',
      caregiver: 'Marcos',
      lastUpdates: [
        {
          date: '05/05/2025',
          by: 'Dr. Ruiz',
          report: 'Evaluación cardiaca',
        },
      ],
      history: [
        {
          label: 'Vacunas aplicadas',
          records: [
            { date: '05/12/2024', vaccine: 'Rabia', dose: '1 ml', next: '05/12/2025' },
          ],
        },
        {
          label: 'Desparasitaciones',
          records: [
            { date: '10/12/2024', product: 'Praziquantel', route: 'oral', next: '10/01/2025' },
          ],
        },
        {
          label: 'Estudios y análisis realizados',
          records: [
            { date: '15/12/2024', type: 'Radiografía torácica', result: 'Sin hallazgos' },
          ],
        },
      ],
      age: 8,
    },
  ]