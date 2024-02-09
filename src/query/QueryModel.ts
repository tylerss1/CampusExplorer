import {QueuingStrategy} from "stream/web";

export interface Head {
	body: string;
	options: string;
	[key: string]: any;
}

export interface Body {
	filter: string | undefined;
	[key: string]: any;
}

export interface Options {
	type: string | undefined;
	[key: string]: any;
}

export interface LogicComp {
	token: string;
	filter_list: object[];
}

export interface MComp {
	mkey: string;
	[key: string]: any;
}

export interface SComp {
	skey: string;
	[key: string]: string;
}
