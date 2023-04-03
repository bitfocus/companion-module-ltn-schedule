import { combineRgb } from '@companion-module/base'
import { lightBlue, lightBlueDisabled, darkGrey, lightGrey, green, red, black, yellow } from '../index.js'

export function initFeedbacks() {
	const feedbacks = {}

	const targets = {
		type: 'multidropdown',
		multiple: true,
		label: 'Push Targets',
		id: 'targets',
		default: 'select',
		choices: this.data.targets.concat({ id: 'select', label: 'Select a target' }),
	}

	const foregroundColor = {
		type: 'colorpicker',
		label: 'Foreground color',
		id: 'fg',
		default: black,
	}

	feedbacks.playbackStatus = {
		type: 'boolean',
		name: 'Playout running status',
		description: 'Indicates if the playout is running',
		defaultStyle: {
			bgcolor: red,
		},
		options: [],
		callback: ({ options }) => {
			if (this.data.playoutRunning) {
				return true
			}
		},
	}

	if (this.data.apiVersion > 1) {
		feedbacks.breakingNewsStatus = {
			type: 'boolean',
			name: 'Breaking news running status',
			description: 'Indicates if the breaking news are displayed',
			defaultStyle: {
				bgcolor: red,
			},
			options: [],
			callback: ({ options }) => {
				if (this.data.breakingNewsRunning) {
					return true
				}
			},
		}
	}

	feedbacks.targetsStatus = {
		type: 'advanced',
		name: 'Targets publish status',
		description: 'Indicate if all the selected targets are published',
		options: [
			targets,
			foregroundColor,
			{
				type: 'colorpicker',
				label: 'Targets disabled',
				id: 'bgDisabled',
				default: darkGrey,
			},
			{
				type: 'colorpicker',
				label: 'Targets enabled',
				id: 'bgEnabled',
				default: lightGrey,
			},
			{
				type: 'colorpicker',
				label: 'Targets pushing',
				id: 'bgPushing',
				default: green,
			},
			{
				type: 'colorpicker',
				label: 'Targets pushing with problem',
				id: 'bgPushingProblem',
				default: red,
			},
		],
		callback: ({ options }) => {
			var actualSelectedTargets = options.targets.filter((target) => target !== 'select')
			var someDisabled = this.data.targets
				.filter((target) => actualSelectedTargets.some((selected) => selected === target.id))
				.some((target) => !target.enabled)
			var someProblem = this.data.targets
				.filter((target) => actualSelectedTargets.some((selected) => selected === target.id))
				.some((target) => target.status != 2)

			if (actualSelectedTargets.length === 0) {
				return { color: options.fg, bgcolor: options.bgDisabled }
			} else if (this.data.publishRunning) {
				if (someDisabled) {
					return { color: options.fg, bgcolor: options.bgDisabled }
				} else if (someProblem) {
					return { color: options.fg, bgcolor: options.bgPushingProblem }
				} else {
					return { color: options.fg, bgcolor: options.bgPushing }
				}
			} else {
				if (someDisabled) {
					return { color: options.fg, bgcolor: options.bgDisabled }
				} else {
					return { color: options.fg, bgcolor: options.bgEnabled }
				}
			}
		},
	}

	feedbacks.publishStatus = {
		type: 'advanced',
		name: 'Publish status',
		description: 'Indicate if the Schedule instance is currently publishing',
		options: [
			foregroundColor,
			{
				type: 'colorpicker',
				label: 'Playback not running',
				id: 'bgDisabled',
				default: lightBlueDisabled,
			},
			{
				type: 'colorpicker',
				label: 'Playback running, publish possible',
				id: 'bgEnabled',
				default: lightBlue,
			},
			{
				type: 'colorpicker',
				label: 'Publish running',
				id: 'bgPushing',
				default: red,
			},
		],
		callback: ({ options }) => {
			if (this.data.playoutRunning && this.data.publishRunning) {
				return { color: options.fg, bgcolor: options.bgPushing }
			} else if (this.data.playoutRunning) {
				return { color: options.fg, bgcolor: options.bgEnabled }
			} else {
				return { color: options.fg, bgcolor: options.bgDisabled }
			}
		},
	}

	feedbacks.skippableStatus = {
		type: 'advanced',
		name: 'Skippable status',
		description: 'Indicate if a skip is possible',
		options: [
			foregroundColor,
			{
				type: 'colorpicker',
				label: 'Not skippable',
				id: 'bgDisabled',
				default: darkGrey,
			},
			{
				type: 'colorpicker',
				label: 'Skippable',
				id: 'bgEnabled',
				default: lightBlue,
			},
			{
				type: 'colorpicker',
				label: 'Skipped, cooldown',
				id: 'bgSkipped',
				default: green,
			},
		],
		callback: ({ options }) => {
			if (this.data.skipUsed) {
				return { color: options.fg, bgcolor: options.bgSkipped }
			} else if (!this.data.playoutRunning) {
				return { color: options.fg, bgcolor: options.bgDisabled }
			} else {
				return { color: options.fg, bgcolor: options.bgEnabled }
			}
		},
	}

	feedbacks.adTriggerStatus = {
		type: 'advanced',
		name: 'Ad trigger status',
		description: 'Indicate if an ad is or can be triggered',
		options: [
			foregroundColor,
			{
				type: 'colorpicker',
				label: 'Triggering an ad is not possible',
				id: 'bgDisabled',
				default: darkGrey,
			},
			{
				type: 'colorpicker',
				label: 'Triggering an ad is possible',
				id: 'bgEnabled',
				default: lightBlue,
			},
			{
				type: 'colorpicker',
				label: 'Ad is currently playing',
				id: 'bgPushing',
				default: green,
			},
		],
		callback: ({ options }) => {
			if (this.data.adRunning != 0) {
				return { color: options.fg, bgcolor: options.bgPushing }
			} else if (
				(this.data.currentItemType === 'livestream' || this.data.breakingNewsRunning || this.data.apiVersion > 3) &&
				this.data.publishRunning
			) {
				return { color: options.fg, bgcolor: options.bgEnabled }
			} else {
				return { color: options.fg, bgcolor: options.bgDisabled }
			}
		},
	}

	if (this.data.apiVersion >= 5) {
		feedbacks.overlayStatus = {
			type: 'boolean',
			name: 'PNG Overlay enabled status',
			description: 'Indicates if the png overlay is set and enabled',
			defaultStyle: {
				bgcolor: lightBlue,
			},
			options: [],
			callback: ({ options }) => {
				return this.data.overlayEnabled
			},
		}

		feedbacks.htmlOverlayStatus = {
			type: 'boolean',
			name: 'HTML Overlay enabled status',
			description: 'Indicates if the HTML overlay is set and enabled',
			defaultStyle: {
				bgcolor: lightBlue,
			},
			options: [],
			callback: ({ options }) => {
				return this.data.htmlOverlayEnabled
			},
		}

		feedbacks.holdStatus = {
			type: 'advanced',
			name: 'Current element hold status',
			description: 'Indicates if the running element has the hold status enabled',
			options: [
				foregroundColor,
				{
					type: 'colorpicker',
					label: 'Playback not running',
					id: 'bgDisabled',
					default: darkGrey,
				},
				{
					type: 'colorpicker',
					label: 'Playback running, item hold deactivated',
					id: 'bgRunningDisabled',
					default: lightBlueDisabled,
				},
				{
					type: 'colorpicker',
					label: 'Playback running, item hold activated',
					id: 'bgRunningEnabled',
					default: lightBlue,
				},
				{
					type: 'colorpicker',
					label: 'Item actively held',
					id: 'bgHolding',
					default: green,
				},
			],
			callback: ({ options }) => {
				if (this.data.hold) {
					return { color: options.fg, bgcolor: options.bgHolding }
				} else if (this.data.currentItemHeld != null && this.data.currentItemHeld && this.data.playoutRunning) {
					return { color: options.fg, bgcolor: options.bgRunningEnabled }
				} else if (this.data.currentItemHeld != null && this.data.playoutRunning) {
					return { color: options.fg, bgcolor: options.bgRunningDisabled }
				} else {
					return { color: options.fg, bgcolor: options.bgDisabled }
				}
			},
		}

		this.log('info', `livestreams ${this.data.livestreams}`)
		const livestreams = {
			type: 'dropdown',
			label: 'Live streams',
			id: 'livestreamSelect',
			tooltip: 'What livestream do you want to track?',
			default: 'select',
			choices: this.data.livestreams.concat({ id: 'select', label: 'Select a livestream' }),
		}

		feedbacks.breakingLiveLivestreamStatus = {
			type: 'boolean',
			name: 'Breaking news activation status',
			description: 'Indicates if the livestream is run as breaking news',
			defaultStyle: {
				bgcolor: red,
			},
			options: [livestreams],
			callback: ({ options }) => {
				if (this.data.breakingNewsRunning && this.data.breakingNewsCurrentId === options.livestreamSelect) {
					return true
				}
			},
		}
	}

	if (this.data.apiVersion >= 6) {
		const UNAVAILABLE_STATUS = 0
		const CACHING_STATUS = 1

		feedbacks.nextElementCaching = {
			type: 'boolean',
			name: 'Next element caching',
			description: 'Indicates if the upcoming element is caching',
			defaultStyle: {
				bgcolor: red,
			},
			options: [],
			callback: ({ options }) => {
				if (this.data.playoutRunning && this.data.elementsStatuses[this.data.upcomingElementId] === CACHING_STATUS) {
					return true
				}
			},
		}
		feedbacks.nextElementUnavailable = {
			type: 'boolean',
			name: 'Next element unavailable',
			description: 'Indicates if the upcoming element is unavailable',
			defaultStyle: {
				bgcolor: yellow,
			},
			options: [],
			callback: ({ options }) => {
				if (this.data.playoutRunning && this.data.elementsStatuses[this.data.upcomingElementId] === UNAVAILABLE_STATUS) {
					return true
				}
			},
		}
		feedbacks.templateInsertStatus = {
			type: 'advanced',
			name: 'Status of the recent template insert',
			description: 'Indicates if a triggered template insertion is running',
			options: [
				foregroundColor,
				{
					type: 'colorpicker',
					label: 'Template can be inserted',
					id: 'bgIdle',
					default: green,
				},
				{
					type: 'colorpicker',
					label: 'Template is being imported',
					id: 'bgImportRunning',
					default: yellow,
				},
				{
					type: 'colorpicker',
					label: 'Template insertion failed',
					id: 'bgInsertFailed',
					default: red,
				},
			],
			callback: ({ options }) => {
				if (this.data.templateInsertStatus === 1) {
					return { color: options.fg, bgcolor: options.bgImportRunning }
				} else if (this.data.templateInsertStatus === 2) {
					return { color: options.fg, bgcolor: options.bgInsertFailed }
				} else {
					return { color: options.fg, bgcolor: options.bgIdle }
				}
			},
		}
	}

	return feedbacks
}
