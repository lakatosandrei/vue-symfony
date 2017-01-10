Vue.component('deposit-station', {
    props: [
        'customId'
    ],
    created: function () {
        let me = this;

        ajax.get('/data', {}, function (response) {
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
        '    <div class="more-btn">More</div>',
        '</div>',
    ].join(''),

    data: function () {
        return {
            dsId: null,
            navAction: {},
            dsData: {},
            showGroup: null,
            loaded: false
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
            this.showGroup = group.items;
            this.saveState();
        },
        goBack: function () {
            this.showGroup = null;
            this.saveState();
        }
    },

    computed: {
        sortOrFilteredList: function () {
            let filterType = this.navAction.filter,
                grouped = this.navAction.group === true,
                list;

            if (!this['dsData']) {
                return [];
            }

            if (this.showGroup) {
                return this.showGroup;
            } else {
                if (grouped) {
                    list = this['dsData']['collections']['patient'].reduce(function (groups, item) {
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
                } else {
                    if (filterType) {
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
                        list = this['dsData']['collections']['patient'];
                    }
                }
            }

            return list;
        }
    }
})