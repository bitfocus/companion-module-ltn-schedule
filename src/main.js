import { InstanceBase, combineRgb } from '@companion-module/base'

import { getActions } from './actions.js'
import { initAPI } from './api.js'
import { getConfigFields } from './config.js'
import { initFeedbacks } from './feedback.js'
import { updateVariableDefinitions, updateVariables } from './variables.js'
import { initPresets } from './presets.js'

export const lightBlue = combineRgb(91, 198, 233)
export const lightBlueDisabled = combineRgb(32, 92, 111)
export const darkGrey = combineRgb(27, 27, 27)
export const lightGrey = combineRgb(117, 117, 117)
export const green = combineRgb(93, 224, 130)
export const red = combineRgb(231, 88, 59)
export const yellow = combineRgb(255, 216, 98)
export const black = combineRgb(255, 255, 255)

/**
 * Companion instance class for LTN Schedule
 */
class LTNScheduleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		// Default instance state
		this.data = {
			playoutRunning: false,
			publishRunning: true,
			targets: [
				{
					id: 'fill',
					label: 'fill',
					enabled: true,
					status: 0,
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
					label: 'fill',
				},
			],
			templates: [
				{
					id: 'fill',
					label: 'fill',
				},
			],
			htmlOverlayEnabled: false,
			overlayEnabled: false,
			currentItemHeld: null,
			hold: false,
			upcomingElementId: '',
			elementsStatuses: {
				fillId: 0,
			},
			templateInsertStatus: 0,
			syncStatus: 0,
			bumperRunning: false,
			startstamp: 0,
			playlistLength: 0,
			currentEndstamp: 0,
			currentStartstamp: 0,
			pgmRecordingStartStamp: 0,
			flexiblePlaybackEnabled: false,
			outputScalingEnabled: false,
			elementRunning: '',
			elementRunningIndex: -1,
			graphicsRundown: [
				{
					id: 'fill',
					label: 'fill',
					status: false,
				},
			],
		}
	}

	async init(config) {
		this.config = config
		this.config.host = config.host || ''
		this.config.username = config.username
		this.config.password = config.password

		if (this.config.host === '') {
			this.updateStatus('bad_config', 'Configuration required')
		} else {
			this.updateStatus('connecting', 'Connecting')
		}
		initAPI.bind(this)()
		this.actions()
		this.init_feedbacks()

		updateVariableDefinitions.bind(this)()
		updateVariables.bind(this)()
		this.variableUpdates = setInterval(updateVariables.bind(this), 1000)

		initPresets.bind(this)()
	}

	// New config saved
	async configUpdated(config) {
		this.config = config
		this.config.host = config.host || ''
		this.config.username = config.username
		this.config.password = config.password

		if (this.variableUpdates) {
			clearInterval(this.variableUpdates)
			delete this.variableUpdates
		}

		initAPI.bind(this)()
		this.actions()
		this.init_feedbacks()
		updateVariableDefinitions.bind(this)()
		updateVariables.bind(this)()
		this.variableUpdates = setInterval(updateVariables.bind(this), 1000)
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
	getConfigFields() {
		return getConfigFields.bind(this)()
	}

	// Instance removal clean up
	async destroy() {
		if (this.pollAPI) {
			clearInterval(this.pollAPI)
			delete this.pollAPI
		}

		if (this.socket) {
			this.socket.close()
			delete this.socket
		}

		if (this.variableUpdates) {
			clearInterval(this.variableUpdates)
			delete this.variableUpdates
		}
	}

	// Set available actions
	actions() {
		this.setActionDefinitions(getActions.bind(this)())
	}

	// Set available feedback choices
	init_feedbacks() {
		const feedbacks = initFeedbacks.bind(this)()
		this.setFeedbackDefinitions(feedbacks)
		this.checkFeedbacks('playbackStatus')
		this.checkFeedbacks('targetsStatus')
	}
}

/**
 * Converts the old advanced 'playbackStatus' feedback (bg/fg options) to a boolean feedback.
 * Under API 2.x option values are wrapped as { isExpression, value }, so the plain colour is unwrapped here.
 */
function convertPlaybackStatusToBoolean(_context, props) {
	const optionToStyle = { bg: 'bgcolor', fg: 'color' }
	const updatedFeedbacks = []

	for (const feedback of props.feedbacks) {
		if (feedback.feedbackId !== 'playbackStatus') continue

		let changed = false
		for (const [optionKey, styleKey] of Object.entries(optionToStyle)) {
			const option = feedback.options[optionKey]
			if (option === undefined) continue

			if (option !== null && typeof option === 'object' && 'isExpression' in option) {
				if (!option.isExpression && typeof option.value === 'number') {
					if (!feedback.style) feedback.style = {}
					feedback.style[styleKey] = option.value
				}
			} else if (typeof option === 'number') {
				if (!feedback.style) feedback.style = {}
				feedback.style[styleKey] = option
			}

			delete feedback.options[optionKey]
			changed = true
		}

		if (changed) updatedFeedbacks.push(feedback)
	}

	return {
		updatedConfig: null,
		updatedSecrets: null,
		updatedActions: [],
		updatedFeedbacks,
	}
}

export const UpgradeScripts = [convertPlaybackStatusToBoolean]

export default LTNScheduleInstance
