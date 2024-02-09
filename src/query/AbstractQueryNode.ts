// Abstract class for the logicNode in AST
// Represents mComparisons, sComparisons, and logical comparators
// Field: logic: defined for mComp and logicComp, undefined for sComp
//        query: used for constructing the AST of logicNodes

import Section from "../model/Section";

export abstract class AbstractQueryNode {
	public token: string;
	public children: AbstractQueryNode[];

	constructor(token: string) {
		this.token = token;
		this.children = [];
	}

	public abstract build_tree(query: any): any;

	public abstract performSection(row: Section): any;
}
