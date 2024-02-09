import {InsightError, InsightResult} from "../controller/IInsightFacade";
import Room from "../model/Room";
import Section from "../model/Section";
import {AbstractQueryNode} from "./AbstractQueryNode";
import {SComp} from "./QueryModel";

export class SCompNode extends AbstractQueryNode {
	public declare token: string;
	private declare skey: string;
	private declare inStr: string;
	private declare wildcard: string;
	private declare sfield: string;
	private sfields: string[] = [
		"dept",
		"id",
		"instructor",
		"title",
		"uuid",
		"fullname",
		"shortname",
		"number",
		"name",
		"address",
		"type",
		"furniture",
		"href",
	];

	constructor(token: string) {
		super(token);
	}

	public build_tree(query: SComp): string {
		this.skey = Object.keys(query)[0];
		this.inStr = query[this.skey];
		let idstring: string = this.skey.substring(0, this.skey.indexOf("_"));
		this.sfield = this.skey.substring(this.skey.indexOf("_") + 1);
		if (this.sfields.indexOf(this.sfield) === -1) {
			throw new InsightError("incorrect sfield");
		}
		if (this.inStr.charAt(0) === "*" && this.inStr.charAt(this.inStr.length - 1) === "*") {
			this.wildcard = "contains";
		} else if (this.inStr.charAt(0) === "*") {
			this.wildcard = "starts_with";
		} else if (this.inStr.charAt(this.inStr.length - 1) === "*") {
			this.wildcard = "ends_with";
		} else {
			this.wildcard = "matches";
		}
		return idstring;
	}

	public performSection(row: Section): boolean {
		if (this.sfield === "dept") {
			return this.performDept(row);
		} else if (this.sfield === "id") {
			return this.performId(row);
		} else if (this.sfield === "instructor") {
			return this.performInstructor(row);
		} else if (this.sfield === "title") {
			return this.performTitle(row);
		} else if (this.sfield === "uuid") {
			return this.performUuid(row);
		}
		return false;
	}

	public performRoom(row: Room): boolean {
		if (this.sfield === "fullname") {
			return this.performFullname(row);
		} else if (this.sfield === "shortname") {
			return this.performShortname(row);
		} else if (this.sfield === "number") {
			return this.performNumber(row);
		} else if (this.sfield === "name") {
			return this.performName(row);
		} else if (this.sfield === "address") {
			return this.performAddress(row);
		} else if (this.sfield === "type") {
			return this.performType(row);
		} else if (this.sfield === "furniture") {
			return this.performFurniture(row);
		} else if (this.sfield === "href") {
			return this.performHref(row);
		}
		return false;
	}

	private performDept(row: Section): boolean {
		if (this.wildcard === "contains" && row["dept"].includes(this.inStr.substring(1, this.inStr.length - 1))) {
			return true;
		} else if (this.wildcard === "starts_with" && row["dept"].startsWith(this.inStr.substring(1))) {
			return true;
		} else if (
			this.wildcard === "ends_with" &&
			row["dept"].endsWith(this.inStr.substring(0, this.inStr.length - 1))
		) {
			return true;
		} else if (this.wildcard === "matches" && row["dept"] === this.inStr) {
			return true;
		}
		return false;
	}

	private performId(row: Section): boolean {
		if (this.wildcard === "contains" && row["id"].includes(this.inStr.substring(1, this.inStr.length - 1))) {
			return true;
		} else if (this.wildcard === "starts_with" && row["id"].startsWith(this.inStr.substring(1))) {
			return true;
		} else if (
			this.wildcard === "ends_with" &&
			row["id"].endsWith(this.inStr.substring(0, this.inStr.length - 1))
		) {
			return true;
		} else if (this.wildcard === "matches" && row["id"] === this.inStr) {
			return true;
		}
		return false;
	}

	private performInstructor(row: Section): boolean {
		if (
			this.wildcard === "contains" &&
			row["instructor"].includes(this.inStr.substring(1, this.inStr.length - 1))
		) {
			return true;
		} else if (this.wildcard === "starts_with" && row["instructor"].startsWith(this.inStr.substring(1))) {
			return true;
		} else if (
			this.wildcard === "ends_with" &&
			row["instructor"].endsWith(this.inStr.substring(0, this.inStr.length - 1))
		) {
			return true;
		} else if (this.wildcard === "matches" && row["instructor"] === this.inStr) {
			return true;
		}
		return false;
	}

	private performTitle(row: Section): boolean {
		if (this.wildcard === "contains" && row["title"].includes(this.inStr.substring(1, this.inStr.length - 1))) {
			return true;
		} else if (this.wildcard === "starts_with" && row["title"].startsWith(this.inStr.substring(1))) {
			return true;
		} else if (
			this.wildcard === "ends_with" &&
			row["title"].endsWith(this.inStr.substring(0, this.inStr.length - 1))
		) {
			return true;
		} else if (this.wildcard === "matches" && row["title"] === this.inStr) {
			return true;
		}
		return false;
	}

	private performUuid(row: Section): boolean {
		if (this.wildcard === "contains" && row["uuid"].includes(this.inStr.substring(1, this.inStr.length - 1))) {
			return true;
		} else if (this.wildcard === "starts_with" && row["uuid"].startsWith(this.inStr.substring(1))) {
			return true;
		} else if (
			this.wildcard === "ends_with" &&
			row["uuid"].endsWith(this.inStr.substring(0, this.inStr.length - 1))
		) {
			return true;
		} else if (this.wildcard === "matches" && row["uuid"] === this.inStr) {
			return true;
		}
		return false;
	}

	private performFullname(row: Room): boolean {
		if (this.wildcard === "contains" && row["fullname"].includes(this.inStr.substring(1, this.inStr.length - 1))) {
			return true;
		} else if (this.wildcard === "starts_with" && row["fullname"].startsWith(this.inStr.substring(1))) {
			return true;
		} else if (
			this.wildcard === "ends_with" &&
			row["fullname"].endsWith(this.inStr.substring(0, this.inStr.length - 1))
		) {
			return true;
		} else if (this.wildcard === "matches" && row["fullname"] === this.inStr) {
			return true;
		}
		return false;
	}

	private performShortname(row: Room): boolean {
		if (this.wildcard === "contains" && row["shortname"].includes(this.inStr.substring(1, this.inStr.length - 1))) {
			return true;
		} else if (this.wildcard === "starts_with" && row["shortname"].startsWith(this.inStr.substring(1))) {
			return true;
		} else if (
			this.wildcard === "ends_with" &&
			row["shortname"].endsWith(this.inStr.substring(0, this.inStr.length - 1))
		) {
			return true;
		} else if (this.wildcard === "matches" && row["shortname"] === this.inStr) {
			return true;
		}
		return false;
	}

	private performNumber(row: Room): boolean {
		if (this.wildcard === "contains" && row["number"].includes(this.inStr.substring(1, this.inStr.length - 1))) {
			return true;
		} else if (this.wildcard === "starts_with" && row["number"].startsWith(this.inStr.substring(1))) {
			return true;
		} else if (
			this.wildcard === "ends_with" &&
			row["number"].endsWith(this.inStr.substring(0, this.inStr.length - 1))
		) {
			return true;
		} else if (this.wildcard === "matches" && row["number"] === this.inStr) {
			return true;
		}
		return false;
	}

	private performName(row: Room): boolean {
		if (this.wildcard === "contains" && row["name"].includes(this.inStr.substring(1, this.inStr.length - 1))) {
			return true;
		} else if (this.wildcard === "starts_with" && row["name"].startsWith(this.inStr.substring(1))) {
			return true;
		} else if (
			this.wildcard === "ends_with" &&
			row["name"].endsWith(this.inStr.substring(0, this.inStr.length - 1))
		) {
			return true;
		} else if (this.wildcard === "matches" && row["name"] === this.inStr) {
			return true;
		}
		return false;
	}

	private performAddress(row: Room): boolean {
		if (this.wildcard === "contains" && row["address"].includes(this.inStr.substring(1, this.inStr.length - 1))) {
			return true;
		} else if (this.wildcard === "starts_with" && row["address"].startsWith(this.inStr.substring(1))) {
			return true;
		} else if (
			this.wildcard === "ends_with" &&
			row["address"].endsWith(this.inStr.substring(0, this.inStr.length - 1))
		) {
			return true;
		} else if (this.wildcard === "matches" && row["address"] === this.inStr) {
			return true;
		}
		return false;
	}

	private performType(row: Room): boolean {
		if (this.wildcard === "contains" && row["type"].includes(this.inStr.substring(1, this.inStr.length - 1))) {
			return true;
		} else if (this.wildcard === "starts_with" && row["type"].startsWith(this.inStr.substring(1))) {
			return true;
		} else if (
			this.wildcard === "ends_with" &&
			row["type"].endsWith(this.inStr.substring(0, this.inStr.length - 1))
		) {
			return true;
		} else if (this.wildcard === "matches" && row["type"] === this.inStr) {
			return true;
		}
		return false;
	}

	private performFurniture(row: Room): boolean {
		if (this.wildcard === "contains" && row["furniture"].includes(this.inStr.substring(1, this.inStr.length - 1))) {
			return true;
		} else if (this.wildcard === "starts_with" && row["furniture"].startsWith(this.inStr.substring(1))) {
			return true;
		} else if (
			this.wildcard === "ends_with" &&
			row["furniture"].endsWith(this.inStr.substring(0, this.inStr.length - 1))
		) {
			return true;
		} else if (this.wildcard === "matches" && row["furniture"] === this.inStr) {
			return true;
		}
		return false;
	}

	private performHref(row: Room): boolean {
		if (this.wildcard === "contains" && row["href"].includes(this.inStr.substring(1, this.inStr.length - 1))) {
			return true;
		} else if (this.wildcard === "starts_with" && row["href"].startsWith(this.inStr.substring(1))) {
			return true;
		} else if (
			this.wildcard === "ends_with" &&
			row["href"].endsWith(this.inStr.substring(0, this.inStr.length - 1))
		) {
			return true;
		} else if (this.wildcard === "matches" && row["href"] === this.inStr) {
			return true;
		}
		return false;
	}
}
