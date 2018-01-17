export enum Status { Actual, Exercise, System, Test, Draft };

export enum MsgType { Alert, Update, Cancel, Ack, Error };

export enum Scope { Public, Restricted, Private };

export enum Category { Geo, Met, Safety, Security, Rescue, Fire, Health, Env, Transport, Infra, CBRNE, Other };

export enum ResponseType { Shelter, Evacuate, Prepare, Execute, Avoid, Monitor, Assess, AllClear, None };

export enum Urgency { Immediate, Expected, Future, Past, Unknown };

export enum Severity { Extreme, Severe, Moderate, Minor, Unknown };

export enum Certainty { Observed, Likely, Possible, Unlikely, Unknown };

export interface ValueNamePair {
	valueName: string;
	value: string;
}

export interface Resource {
	resourceDesc: string;
	size?: null | undefined | number;
	uri?: null | undefined | string;
	deferUri?: null | undefined | string;
	digest?: null | undefined | string;
}

export interface Area {
	areaDesc: string;
	polygon?: null | undefined | string | string[];
	circle?: null | undefined | string | string[];
	geocode?: null | undefined | eu.driver.model.cap.ValueNamePair | eu.driver.model.cap.ValueNamePair[];
	altitude?: null | undefined | number;
	ceiling?: null | undefined | number;
}

export interface Info {
	language: string | null | undefined;
	category: Category | eu.driver.model.cap.Category[];
	event: string;
	responseType?: null | undefined | ResponseType | eu.driver.model.cap.ResponseType[];
	urgency: Urgency;
	severity: Severity;
	certainty: Certainty;
	audience?: null | undefined | string;
	eventCode?: null | undefined | ValueNamePair | eu.driver.model.cap.ValueNamePair[];
	effective?: null | undefined | string;
	onset?: null | undefined | string;
	expires?: null | undefined | string;
	senderName?: null | undefined | string;
	headline?: null | undefined | string;
	description?: null | undefined | string;
	instruction?: null | undefined | string;
	web?: null | undefined | string;
	contact?: null | undefined | string;
	parameter?: null | undefined | eu.driver.model.cap.ValueNamePair | eu.driver.model.cap.ValueNamePair[];
	resource?: null | undefined | Resource | eu.driver.model.cap.Resource[];
	area?: null | undefined | Area | eu.driver.model.cap.Area[];
}

export interface eu.driver.model.cap.Alert {
	identifier: string;
	sender: string;
	sent: string;
	status: Status;
	msgType: MsgType;
	source?: null | undefined | string;
	scope: Scope;
	restriction?: null | undefined | string;
	addresses?: null | undefined | string;
	code?: null | undefined | string | string[];
	note?: null | undefined | string;
	references?: null | undefined | string;
	incidents?: null | undefined | string;
	info?: null | undefined | Info | eu.driver.model.cap.Info[];
}
