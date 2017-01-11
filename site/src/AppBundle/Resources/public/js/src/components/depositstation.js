Vue.component('deposit-station', {
    props: [
        'customId'
    ],
    created: function () {
        let me = this;

        ajax.get('/data/' + me.page + '/' + me.pageSize, {}, function (response) {
            let prevData,
                dsData,
                jsonBody;

            me.dsId = me.createId();
            prevData = localStorage.getItem('deposit-station-' + me.dsId);
            dsData = prevData && JSON.parse(prevData);

            try {
                jsonBody = JSON.parse(response);
            } catch (e) {
                console.log(e);
            }

            if (jsonBody) {
                me.dsData = jsonBody;

                if (dsData) {
                    me.navAction = dsData['navAction'];
                    me.showGroup = dsData['showGroup'];
                }

                me.loaded = true;
            }
        })
    },
    template: [
        '<div v-if="loaded" class="deposit-station">',
        '    <ul class="dep-st-list">',
        '        <label v-if="showGroup" @click="goBack">Back</label>',
        '        <li class="dep-st-item" v-for="patient in sortOrFilteredList">',
        '            <div v-if="navAction.group && !showGroup">',
        '                <label @click="displayGroup(patient)">{{ patient.name }}</label>',
        '            </div>',
        '            <div v-else>',
        '            <div class="v-mask" @click="showDetails(patient, $event)"></div>',
        '            <label>{{ patient.label }}</label>',
        '            <label>Tel: {{ patient.details.tel  }} <span v-if="!patient.details.tel">-</span></label>',
        '            <label v-for="(detail, key) in patient.details" v-if="key !== \'tel\'" class="hidden" v-bind:class="{ show: patient.visible }">',
        '                {{ key }} - {{ detail }}',
        '            </label>',
        '            </div>',
        '        </li>',
        '    </ul>',
        '    <ul class="dep-st-nav">',
        '        <ul class="dep-st-nav-list">',
        '            <li class="dep-st-nav-item" v-for="action in dsData.navigation">',
        '                <label @click="doAction(action)">{{ action.name }}</label>',
        '            </li>',
        '        </ul>',
        '    </ul>',
        '    <div class="more-btn" v-if="!dataOver" @click="loadMore">More</div>',
        '</div>',
    ].join(''),

    data: function () {
        return {
            dsId: null,
            dataOver: false,
            navAction: {},
            dsData: {},
            showGroup: null,
            loaded: false,
            page: 1,
            pageSize: 10
        };
    },

    methods: {
        createId: function () {
            let me = this,
                i;

            if (me.customId && !app.dsIds[me.customId]) {
                app.dsIds[me.customId] = true;
                return me.customId;
            }

            i = 0;

            while (true) {
                if (!app.dsIds[i]) {
                    app.dsIds[i] = true;
                    return i;
                }

                i++;
            }
        },
        saveState: function () {
            let me = this;

            localStorage.setItem('deposit-station-' + me.dsId, JSON.stringify({
                navAction: me.navAction,
                showGroup: me.showGroup
            }));
        },
        showDetails: function (patient) {
            Vue.set(patient, 'visible', !patient.visible);
        },
        doAction: function (action) {
            this.showGroup = null;
            this.navAction = action;
            this.saveState();
        },
        displayGroup: function (group) {
            this.showGroup = group.name;
            this.saveState();
        },
        goBack: function () {
            this.showGroup = null;
            this.saveState();
        },
        loadMore: function () {
            let me = this;

            ajax.get('/data/' + (++me.page) + '/' + me.pageSize, {}, function (response) {
                let jsonBody;

                try {
                    jsonBody = JSON.parse(response);
                } catch (e) {
                    console.log(e);
                }

                if (jsonBody) {
                    me.dsData.collections.patient = me.dsData.collections.patient.concat(jsonBody.collections.patient);
                    me.dataOver = jsonBody['data_over'];
                }
            })
        }
    },

    computed: {
        sortOrFilteredList: function () {
            let filterType = this.navAction.filter,
                grouped = this.navAction.group === true,
                list,
                allGroups;

            // If we don't have any data, we return an empty array
            if (!this['dsData']) {
                return [];
            }

            // If the user selected the "GROUP" button from the navigation bar
            if (grouped) {
                // We get all the groups from the data received
                allGroups = this['dsData']['collections']['patient'].reduce(function (groups, item) {
                    let groupObj = groups[item.group];

                    if (!groupObj) {
                        groups[item.group] = {
                            name: item.group,
                            active: item.status === 1,
                            items: []
                        };
                    } else {
                        if (groupObj.active) {
                            groupObj.active = item.status === 1;
                            groupObj.items.push(item);
                        }
                    }

                    return groups;
                }, {});

                // If the user already selected a specific group, we return the list of items from that group
                if (this.showGroup) {
                    list = allGroups[this.showGroup].items;
                } else {
                    // Otherwise we return the list of groups
                    list = allGroups;
                }
            } else {
                // If the user is not in the grouped navigation
                if (filterType) {
                    /*
                    If we have a filterType in the navAction, we filter the items by the specific values
                    */
                    list = this['dsData']['collections']['patient'].filter(function (patient) {
                        let retValue = true;

                        Object.keys(filterType).forEach(function (key) {
                            if (patient[key] !== filterType[key]) {
                                retValue = false;
                            }
                        });

                        return retValue;
                    });
                } else {
                    // Otherwise, we just return the unfiltered list
                    list = this['dsData']['collections']['patient'];
                }
            }


            return list;
        }
    }
})