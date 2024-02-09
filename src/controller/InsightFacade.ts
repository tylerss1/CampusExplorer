import Section from "../model/Section";
import {OptionsNode} from "../query/OptionsNode";
import {QueryNode} from "../query/QueryNode";
import DiskHandler from "./DatasetProcessor/DiskHandler";
import SectionHandler from "./DatasetProcessor/SectionHandler";
import {
	IInsightFacade,
	InsightDataset,
	InsightDatasetKind,
	InsightError,
	InsightResult,
	NotFoundError,
	ResultTooLargeError,
} from "./IInsightFacade";
import * as fs from "fs";

/**
 * This is the main programmatic entry point for the project.
 * Method documentation is in IInsightFacade
 *
 */
export default class InsightFacade implements IInsightFacade {
	private dataSets: Map<string, Section[]>;
	private DiskHandler;
	private SectionHandler;

	constructor() {
		this.SectionHandler = new SectionHandler();
		this.DiskHandler = new DiskHandler();
		this.dataSets = new Map<string, Section[]>();
		this.dataSets = this.DiskHandler.retrieveDisk();
	}

	public async addDataset(id: string, content: string, kind: InsightDatasetKind): Promise<string[]> {
		if (kind === InsightDatasetKind.Rooms) {
			return Promise.reject(new InsightError("temporary hard code"));
		}

		if (!this.SectionHandler.validateContent(content)) {
			return Promise.reject(new InsightError("Invalid content string"));
		}

		if (!this.SectionHandler.validateID(id)) {
			return Promise.reject(new InsightError("Invalid ID"));
		}

		this.dataSets = this.DiskHandler.retrieveDisk();

		if ([...this.dataSets.keys()].includes(id)) {
			return Promise.reject(new InsightError("ID already exists."));
		}

		try {
			await this.DiskHandler.saveSection(id, content);
		} catch (error) {
			return Promise.reject(new InsightError("Unable to save data to disk."));
		}

		try {
			let newSectionMap = await this.SectionHandler.loadSectionToMemory(id, content);
			for (const [key, value] of newSectionMap) {
				this.dataSets.set(key, value);
			}
		} catch (error) {
			return Promise.reject(new InsightError("Unable to save data to memory."));
		}

		return Promise.resolve([...this.dataSets.keys()]);
	}

	public async removeDataset(id: string): Promise<string> {
		if (!this.SectionHandler.validateID(id)) {
			return Promise.reject(new InsightError("Invalid ID."));
		}
		const path: string = "./data/" + id + ".json";

		try {
			let deleted: boolean = this.dataSets.delete(id);
			if (!deleted) {
				throw new NotFoundError("ID not found");
			}
		} catch (error) {
			return Promise.reject(new NotFoundError("ID not found"));
		}

		return Promise.resolve(id);
	}

	public performQuery(query: unknown): Promise<InsightResult[]> {
		let result: InsightResult[] = [];
		try {
			let queryString: string = JSON.stringify(query);
			let head: QueryNode = new QueryNode("HEAD");
			let idstring: string = head.build_tree(queryString);
			if (idstring.length < 1) {
				throw new InsightError("invalid dataset");
			}
			if (idstring === "rooms") {
				result = [];
			} else {
				let dataSet: Section[] | undefined = this.dataSets.get(idstring);
				if (this.dataSets.get(idstring) !== undefined) {
					if (dataSet !== undefined) {
						for (let row of dataSet) {
							let res: InsightResult = head.performOptions(row);
							if (JSON.stringify(res) !== JSON.stringify({})) {
								result.push(head.performOptions(row));
							}
							if (result.length > 5000) {
								throw new ResultTooLargeError("More than 5000 results!");
							}
						}
						if (head.children[1] instanceof OptionsNode) {
							head.children[1].performSectionOrder(result);
						}
					}
				}
			}
		} catch (error) {
			return Promise.reject(error);
		}
		return Promise.resolve(result);
	}

	public listDatasets(): Promise<InsightDataset[]> {
		let dataList: InsightDataset[] = [];
		for (const [key, value] of this.dataSets) {
			let data = {
				id: key,
				kind: InsightDatasetKind.Sections,
				numRows: value.length,
			};
			dataList.push(data);
		}
		return Promise.resolve(dataList);
	}
}
