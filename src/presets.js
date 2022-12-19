import { combineRgb } from '@companion-module/base'
import { lightBlue, lightBlueDisabled, darkGrey, lightGrey, green, red, black } from '../index.js'

export function initPresets() {
	const presets = {}
	const pstSize = '18'
	this.data.targets
		.map((target) => {
			return {
				id: target.id,
				type: 'button',
				category: 'Push Targets',
				name: target.label,
				options: {},
				style: {
					text: target.label,
					size: pstSize,
					color: '16777215',
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [
					{
						down: [
							{
								actionId: 'targets_toggle',
								options: {
									targetsSelect: [target.id],
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: 'targetsStatus',
						options: {
							targets: [target.id],
							fg: black,
							bgDisabled: darkGrey,
							bgEnabled: lightGrey,
							bgPushing: green,
							bgPushingProblem: red,
						},
					},
				],
			}
		})
		.forEach((element) => {
			presets[element.id] = element
		})

	presets.toggle_playback = {
		category: 'Commands',
		type: 'button',
		name: 'Toggle Playback',
		options: {},
		style: {
			text: 'Toggle playback',
			size: pstSize,
			color: '16777215',
			bgcolor: combineRgb(91, 198, 233),
		},
		steps: [
			{
				down: [
					{
						actionId: 'playback_toggle',
						options: {
							startstamp: 0,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'playbackStatus',
				style: {
					bgcolor: combineRgb(231, 88, 59),
				},
				options: {},
			},
		],
	}

	presets.toggle_publish = {
		category: 'Commands',
		type: 'button',
		name: 'Toggle Publish',
		options: {},
		style: {
			text: 'Toggle publish',
			size: pstSize,
			color: '16777215',
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: 'publish_toggle',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'publishStatus',
				options: {
					fg: black,
					bgDisabled: lightBlueDisabled,
					bgEnabled: lightBlue,
					bgPushing: red,
				},
			},
		],
	}

	presets.skip_element = {
		category: 'Commands',
		type: 'button',
		name: 'Skip element',
		options: {},
		style: {
			text: 'Skip element',
			size: pstSize,
			color: '16777215',
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: 'playback_skip',
						options: {
							strategy: 'snap',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'skippableStatus',
				options: {
					fg: black,
					bgDisabled: darkGrey,
					bgEnabled: lightBlue,
					bgSkipped: green,
				},
			},
		],
	}

	presets.trigger_ad = {
		category: 'Commands',
		type: 'button',
		name: 'Trigger ad',
		options: {},
		style: {
			text: 'Trigger ad',
			size: pstSize,
			color: '16777215',
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: 'playback_ad',
						options: {
							adLength: '30',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'adTriggerStatus',
				options: {
					fg: black,
					bgDisabled: darkGrey,
					bgEnabled: lightBlue,
					bgPushing: green,
				},
			},
		],
	}

	if (this.data.apiVersion > 1) {
		presets.toggle_breaking_news = {
			category: 'Commands',
			type: 'button',
			name: 'Toggle Breaking News',
			options: {},
			style: {
				text: 'Toggle Breaking News',
				size: pstSize,
				color: '16777215',
				bgcolor: combineRgb(91, 198, 233),
			},
			steps: [
				{
					down: [
						{
							actionId: 'breaking_news',
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'breakingNewsStatus',
					style: {
						bgcolor: combineRgb(231, 88, 59),
					},
					options: {},
				},
			],
		}
	}

	if (this.data.apiVersion > 3) {
		presets.cancel_ad = {
			category: 'Commands',
			type: 'button',
			name: 'Cancel ad',
			options: {},
			style: {
				text: 'Cancel ad',
				size: pstSize,
				color: '16777215',
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'cancel_ad',
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'adTriggerStatus',
					options: {
						fg: black,
						bgDisabled: darkGrey,
						bgEnabled: lightBlue,
						bgPushing: green,
					},
				},
			],
		}
	}

	this.setPresetDefinitions(presets)
}
