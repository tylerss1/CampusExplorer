import {privateEncrypt} from "crypto";
import {AbstractQueryNode} from "./AbstractQueryNode";
import {InsightError} from "../controller/IInsightFacade";
import {MCompNode} from "./MCompNode";
import {SCompNode} from "./SCompNode";
import {LogicComp, MComp, SComp} from "./QueryModel";
import Section from "../model/Section";
import Room from "../model/Room";

// Logic: AND | OR
export class LogicCompNode extends AbstractQueryNode {
	public declare token: string;
	public declare children: AbstractQueryNode[];
	public filter_list_len: number = 0;
	private idstring: string = "";

	constructor(token: string) {
		super(token);
	}

	public build_tree(query: LogicComp): string {
		if (query.filter_list instanceof Array) {
			this.filter_list_len = query.filter_list.length;
			if (this.token === "NOT" && this.filter_list_len !== 1) {
				throw new InsightError("too many arguments to NOT");
			}
			let givenid: string = "";
			for (let i = 0; i < this.filter_list_len; i++) {
				let subQuery: any = query.filter_list[i];
				let filter: string = Object.keys(subQuery)[0];
				if (filter === "AND" || filter === "OR" || filter === "NOT") {
					let lChild: LogicComp = {token: filter, filter_list: subQuery[filter]};
					let lNode: LogicCompNode = new LogicCompNode(filter);
					this.children.push(lNode);
					givenid = lNode.build_tree(lChild);
				}
				if (filter === "GT" || filter === "LT" || filter === "EQ") {
					let mChild: MComp = subQuery[filter];
					let mNode: MCompNode = new MCompNode(filter);
					this.children.push(mNode);
					givenid = mNode.build_tree(mChild);
				}
				if (filter === "IS") {
					let sChild: SComp = subQuery[filter];
					let sNode: SCompNode = new SCompNode("IS");
					this.children.push(sNode);
					givenid = sNode.build_tree(sChild);
				}
				if (this.idstring === "") {
					this.idstring = givenid;
				} else {
					if (this.idstring !== givenid) {
						throw new InsightError("references multiple datasets!");
					}
				}
			}
		} else {
			throw new InsightError("Missing logic arguments");
		}
		return this.idstring;
	}

	public performSection(row: Section): boolean {
		if (this.token === "AND") {
			// do and ==> if any return false, return false
			for (const child of this.children) {
				if (!child.performSection(row)) {
					return false;
				}
			}
			return true;
		}
		if (this.token === "OR") {
			// do or ==> if any return true, return true
			for (const child of this.children) {
				if (child.performSection(row)) {
					return true;
				}
			}
			return false;
		}
		if (this.token === "NOT") {
			// do not ==> return NOT of this
			return !this.children[0].performSection(row);
		}
		return false;
	}
}
