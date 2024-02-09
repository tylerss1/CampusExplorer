import {generateNodeStream} from "jszip";
import {InsightError, InsightResult} from "../controller/IInsightFacade";
import {AbstractQueryNode} from "./AbstractQueryNode";
import {MCompNode} from "./MCompNode";
import {SCompNode} from "./SCompNode";
import {Head, Body, LogicComp, MComp, SComp, Options} from "./QueryModel";
import {LogicCompNode} from "./LogicCompNode";
import Room from "../model/Room";
import Section from "../model/Section";
import {OptionsNode} from "./OptionsNode";
import {NONAME} from "dns";
import e from "express";

export class QueryNode extends AbstractQueryNode {
	// token can be: HEAD, WHERE, OPTIONS
	public declare token: string;
	public declare children: AbstractQueryNode[];

	constructor(token: string) {
		super(token);
		this.children = [];
	}

	public build_tree(query: string): string {
		let idstring: string = "";
		if (this.token === "HEAD") {
			idstring = this.build_head(query);
		} else if (this.token === "WHERE") {
			idstring = this.build_body(query);
		} else if (this.token === "OPTIONS") {
			// compute OPTIONS
		}
		return idstring;
	}

	/* Build the head node, based on the given input query string
    Returns: idstring of the dataset being targeted.
    */
	private build_head(query: string): string {
		let idstring: string = "";
		let sQuery: Head = JSON.parse(query);

		if (sQuery.WHERE === undefined) {
			throw new InsightError("no where block in query");
		}
		let bodyChild: object = sQuery.WHERE;
		let bodyNode: QueryNode = new QueryNode("WHERE");
		this.children.push(bodyNode);
		if (bodyChild instanceof Object) {
			idstring = bodyNode.build_tree(JSON.stringify(bodyChild));
		}
		if (sQuery.OPTIONS === undefined) {
			throw new InsightError("no options block in query");
		}
		let optChild: object = sQuery.OPTIONS;
		let optNode: OptionsNode = new OptionsNode("OPTIONS");
		this.children.push(optNode);
		if (optChild instanceof Object) {
			optNode.build_tree(optChild);
		}
		return idstring;
	}

	/* Build the body node, based on the given input query string
    Returns: idstring of the dataset being targeted.
    */
	private build_body(query: string): string {
		// logicNode (AND, OR, NOT)
		let idstring: string = "";
		let bQuery: Body = JSON.parse(query);
		let filter: string = Object.keys(bQuery)[0];
		if (Object.keys(bQuery)[0] === undefined) {
			return idstring;
		}
		if (filter === "AND" || filter === "OR" || filter === "NOT") {
			let lChild: LogicComp = {token: filter, filter_list: bQuery[filter]};
			let lNode: LogicCompNode = new LogicCompNode(filter);
			this.children.push(lNode);
			idstring = lNode.build_tree(lChild);
		}
		if (filter === "GT" || filter === "LT" || filter === "EQ") {
			let mChild: MComp = bQuery[filter];
			let mNode: MCompNode = new MCompNode(filter);
			this.children.push(mNode);
			idstring = mNode.build_tree(mChild);
		}
		if (filter === "IS") {
			let sChild: SComp = bQuery[filter];
			let sNode: SCompNode = new SCompNode("IS");
			this.children.push(sNode);
			idstring = sNode.build_tree(sChild);
		}
		return idstring;
	}

	public performSection(row: Section): boolean {
		return this.children[0].performSection(row);
	}

	public performOptions(row: Section): InsightResult {
		if (this.token === "WHERE") {
			throw new InsightError("Error");
		}
		if (this.performSection(row)) {
			return this.children[1].performSection(row);
		}
		return {};
	}
}
