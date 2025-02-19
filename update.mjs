import { promises as fs } from 'fs';




const jsonContents = await fs.readFile("data/gpts.json", 'utf8');
const flow = JSON.parse(jsonContents).filter(data =>  !data.nsfw && data.categoryId!=1 && data.category.name!="Models" ||data.subCategory.uri=="jailbreak" );
//files

let i =0;
for (let data of flow) {
    if(data.subCategory.uri=="jailbreak" )    
    {
        data.categoryId=666
        data.category.name="Jailbreaks"
    }
    data.uri = data.uri.substring(0, 200);
    let url = ''
    const markdown = `
[![${data.title}](${data.thumbnailURL})](${url})
# ${data.title} 
${data.description.replace(/\n/g, '\n\n')}

# Prompt

\`\`\`
${data.initPrompt}
\`\`\`

## Conversation

${data.Conversation.messages.map(message => `**${message.role.toUpperCase()}**: ${message.content.replace(/\n/g, '\n\n')}`).join('\n')}


`;
    await fs.writeFile(`gpts/${data.uri}.md`, markdown);
    
}






//categories

const groups = groupBy(flow, "categoryId");

let header = ``;

for (let groupId of Object.getOwnPropertyNames(groups)) {
    let name = groups[groupId][0].category.name;

    console.log(name);

    // Append category links to readmeContent, renaming 'Others' to 'readme'
    header += `- [${name}](./${name.replace(/\s+/g, '-')}.md)\n`;
}
await fs.writeFile(`README.md`, `# BlackFriday GPTs Prompts And Jailbreaks\n\n`+header);

for (let groupId of Object.getOwnPropertyNames(groups)) {
    let name = groups[groupId][0].category.name;

    let readmeContent = `${header}\n\n# ${name}\n\n`;

    for (let item of groups[groupId]) {
        let desc = item.description.replace(/[\r\n]+/g, ' ').trim().substring(0, 250);
        readmeContent += `- [${item.title}](./gpts/${item.uri}.md) ${desc}\n`;
    }

    await fs.writeFile(`${name.replace(/\s+/g, '-')}.md`, readmeContent);

}



function groupBy(array, key) {
    return array.reduce((result, currentItem) => {
        const groupKey = currentItem[key];
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(currentItem);
        return result;
    }, {});
}
