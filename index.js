const instance_skel = require('../../instance_skel')
const { executeAction, getActions } = require('./src/actions')
const { initAPI } = require('./src/api')
const { getConfigFields } = require('./src/config')
const { executeFeedback, initFeedbacks } = require('./src/feedback')
const { updateVariableDefinitions } = require('./src/variables')
const { initPresets } = require('./src/presets')

/**
 * Companion instance class for LTN Schedule
 */
class LTNScheduleInstance extends instance_skel {
	constructor(system, id, config) {
		super(system, id, config)

		// Default instance state
		this.data = {
			playoutRunning: false,
			publishRunning: true,
			targets: [
				{
					id: 'fill',
					label: 'fill',
					enabled: true,
					status: 0
				},
			],
			currentItemType: '',
			adRunning: 0,
			skipUsed: false,
			apiVersion: 0,
			breakingNewsRunning: false,
			breakingNewsCurrentId: '',
			livestreams: [
				{
					id: 'fill',
					title: 'fill'
				}
			]
		}

		this.config.host = this.config.host || ''
		this.config.username = this.config.username
		this.config.password = this.config.password
		this.updateVariableDefinitions = updateVariableDefinitions
	}

	// Init module
	init() {
		this.status(1, 'Connecting')
		this.actions()
		initAPI.bind(this)()
		this.init_feedbacks()
		initPresets.bind(this)()
		this.updateVariableDefinitions()
	}

	// New config saved
	updateConfig(config) {
		this.actions()
		this.config = config
		initAPI.bind(this)()
		this.init_feedbacks()
		initPresets.bind(this)()
	}

	updateElements() {
		this.actions()
		this.init_feedbacks()
		initPresets.bind(this)()
	}

	updatePresets() {
		initPresets.bind(this)()
	}

	// Set config page fields
	config_fields() {
		return getConfigFields.bind(this)()
	}

	// Instance removal clean up
	destroy() {

		if(this.pollAPI) {
			clearInterval(this.pollAPI)
			delete this.pollAPI;
		}

		if (this.socket) {
			this.socket.close()
			delete this.socket;
		}

		this.debug('destroy', this.id)
	}

	// Set available actions
	actions() {
		this.setActions(getActions.bind(this)())
	}

	// Execute action
	action(action) {
		executeAction.bind(this)(action)
	}

	// Set available feedback choices
	init_feedbacks() {
		const feedbacks = initFeedbacks.bind(this)()
		this.setFeedbackDefinitions(feedbacks)
		this.checkFeedbacks('playbackStatus')
		this.checkFeedbacks('targetsStatus')
	}

	// Execute feedback
	feedback(feedback, bank) {
		return executeFeedback.bind(this)(feedback, bank)
	}

	static GetUpgradeScripts() {
		return [
			instance_skel.CreateConvertToBooleanFeedbackUpgradeScript({
				'playbackStatus': true,
			})
		]
	}
}

module.exports = LTNScheduleInstance
