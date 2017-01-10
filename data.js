       var data = {
                navigation: [
                    {
                        id: 'AZ',
                        name: 'sortation',
                        url: 'patient-list',
                        title: 'Patienten-Liste',
                        collection: 'patient',
                        group: false,
                        filter: {status: 1},
						 filterBox: [
                            {type: 'text' , value: ['name']}
                        ]
                    },
                    {
                        id: 'group',
                        name: 'group',
                        url: 'patient-list',
                        title: 'Patienten-Liste',
                        collection: 'patient',
                        group: true
                    },
                    {
                        id: 'archive',
                        name: 'archive',
                        url: 'patient-list-archived',
                        title: 'Liste der archivierten Patienten',
                        collection: 'patient',
                        group: false,
                        filter: {status: 0}
                    }
                ],
                collections: {
                    patient: [
                        {id: 1, label : 'Vier Testfall', group:  'Mende, Manuela', status: 1, details: {email: 'test@test.de' , tel : '1234'}},
                        {id: 2,label : 'Beata Brysz', group: 'Ittri, Mulham', status: 1, details: {email: 'test@test.de' , tel : '1234'}},
                        {id: 3,label: 'Claus Nolte', group: 'Ittri, Mulham', status: 1, details: {email: 'test@test.de' , tel : '1234'}},
                        {id: 4,label: 'Andrea Kuckuck', group:  'Mende, Manuela', status: 1, details: {email: 'test@test.de' , tel : '1234'}},
                        {id: 5,label: 'Frank Weigel', group:  'Mende, Manuela', status: 1, details: {email: 'test@test.de' , tel : '1234'}},
                        {id: 6,label: 'Marie Meier', group: 'Ittri, Mulham', status: 1, details: {email: 'test@test.de' , tel : '1234'}},
                        {id: 7,label: 'Heike Otto', group: 'Ittri, Mulham', status: 0, details: {email: 'test@test.de' , tel : '1234'}}
                    ]
                }

            };
