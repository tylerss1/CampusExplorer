import * as http from "http";
import * as parse5 from "parse5";
import Room from "../../model/Room";
import JSZip from "jszip";

interface GeoResponse {
	lat?: number;

	lon?: number;

	error?: string;
}

export default class RoomHandler {
	public async fetchGeoLocation(address: string): Promise<GeoResponse> {
		// Partial ChatGPT usage
		return new Promise((resolve, reject) => {
			const encodedAddress = encodeURIComponent(address);
			const options = {
				hostname: "cs310.students.cs.ubc.ca",
				port: 11316,
				path: `/api/v1/project_team285/${encodedAddress}`,
				method: "GET",
			};

			const req = http.request(options, (res) => {
				let data = "";
				res.on("data", (chunk) => {
					data += chunk;
				});

				res.on("end", () => {
					const jsonResponse = JSON.parse(data) as GeoResponse;
					resolve(jsonResponse);
				});
			});

			req.on("error", (error) => {
				reject({error: "Failed to fetch geolocation"});
			});

			req.end();
		});
	}

	public async getRooms(content: string): Promise<Map<string, any[]>> {
		const zipBuffer = Buffer.from(content, "base64");
		const zip = await JSZip.loadAsync(zipBuffer);

		const roomFields: Map<string, any[]> = new Map<string, any[]>();
		const rootFolderName = Object.keys(zip.files)[0].split("/")[0];
		const folderPath = `${rootFolderName}/campus/discover/buildings-and-classrooms/`;

		const promises: any[] = [];

		zip.forEach((relativePath, file) => {
			if (relativePath.startsWith(folderPath) && relativePath.endsWith(".htm")) {
				const promise = file.async("text").then((fileContent) => {
					const fileName = relativePath.replace(`${rootFolderName}/`, "");
					const fileNameWithoutExtension = fileName.split("/").pop()?.replace(".htm", "") || "";
					const rowsData = this.parseRoomsHTML(fileContent);
					roomFields.set(fileNameWithoutExtension, rowsData);
				});
				promises.push(promise);
			}
		});

		await Promise.all(promises);

		return roomFields;
	}

	public parseRoomsHTML(content: string): any[] {
		const document = parse5.parse(content);
		const tableData: any[] = [];
		let currentRow: any[] = [];

		const processNode = (node: any) => {
			if (node.tagName === "tr") {
				if (currentRow.length > 0) {
					tableData.push(currentRow);
					currentRow = [];
				}
			} else if (node.tagName === "td") {
				let cellContent = "";
				for (const child of node.childNodes || []) {
					if (child.nodeName === "#text") {
						cellContent += child.value.trim();
					}
					if (child.tagName === "a") {
						cellContent += " " + child.attrs[0].value;
					}
				}
				currentRow.push(cellContent);
			}

			for (const child of node.childNodes || []) {
				processNode(child);
			}
		};

		processNode(document);

		if (currentRow.length > 0) {
			tableData.push(currentRow);
		}

		return tableData;
	}
}
