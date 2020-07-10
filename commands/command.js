const Discord = require('discord.js');
const api = require('novelcovid');
const { CanvasRenderService } = require('chartjs-node-canvas')

const newEmbed = (options,embed)=> new Discord.MessageEmbed(embed)
	.setColor(options.color||'')
    .setTitle(options.title||'')
    .setURL(options.url)
	.setAuthor(options.author&&options.author.name||'', options.author&&options.author.url||'')
	.setDescription(options.description||'')
    .setThumbnail(options.thumbnail||'')
    .attachFiles(options.files || [])
	.addFields(options.fields||[])
	.setImage(options.image||'')
	.setTimestamp()
    .setFooter(options.footer||'');



const help =async (message,arguments)=>{
    //show all commands
    const embed = newEmbed({
        color:'#022c43',
        author:{name : "Covid stats", url: 'https://cdn.discordapp.com/icons/707227171835609108/f308f34a45ac7644506fb628215a3793.png?size=128' },
        description : "this is the help section",
        title:"All commands",
        fields:[
            {name :'Help', value:'`cov help`\n show avalible commands',inline : true},
            {name :'Invite', value:'`cov invite`\n get bot on your own server',inline : true},
            {name :'All', value:'`cov all`\n show status of all countries',inline : true},
            {name :'Country', value:'`cov country {country}`\n show status of a country',inline : true},
            {name :'Graph', value:'`cov graph {country|all} [log|linear]`\n shows a details graph with cases deaths and recovery rate',inline : true},
            {name :'Overview', value:'`cov overview {country|all}`\n shows overview chart with active, deaths and recovered',inline : true},
            {name :'State', value:'`cov state {state}`\n show detailed covid stats for a US state',inline : true},
            {name :'rankings', value:'`cov ranks [{property}]`\n shows stats of highle infected countries',inline : true},
            {name :'Country Compare', value:'`cov compare {country} {country}`\n compare covid stats of 2 countries',inline : true}
        ],
        url :'https://github.com/theStonedSage' 
    })
    await message.channel.send(embed);
}

async function all(message){
    const data = await api.all();
    const prevdata = await api.yesterday.all();
    data.todayActive = data.active - prevdata.active;
    data.todayrec = data.recovered - prevdata.recovered;
    data.totalcritical = data.critical - prevdata.critical;
    data.todayTests = data.tests - prevdata.tests;
    const embed = newEmbed({
        color:'#022c43',
        author:{name : "Covid stats", url: 'https://cdn.discordapp.com/icons/707227171835609108/f308f34a45ac7644506fb628215a3793.png?size=128' },
        description : "this is the help section",
        title:"Global data",
        fields:[
            {name :'cases', value:`${data.cases}\n${(data.todayCases>=0?'+':'-')+String(Math.abs(data.todayCases))}`,inline : true},
            {name :'deaths', value:`${data.deaths}\n${(data.todayDeaths>=0?'+':'-')+String(Math.abs(data.todayDeaths))}`,inline : true},
            {name :'Active', value:`${data.active}\n${(data.todayActive>=0?'+':'-')+String(Math.abs(data.todayActive))}`,inline : true},
            {name :'Recovered', value:`${data.recovered}\n${(data.todayrec>=0?'+':'-')+String(Math.abs(data.todayrec))}`,inline : true},
            {name :'Critical', value:`${data.critical}\n${(data.totalcritical>=0?'+':'-')+String(Math.abs(data.totalcritical))}`,inline : true},
            {name :'Tests', value:`${data.tests}\n${(data.todayTests>=0?'+':'-')+String(Math.abs(data.todayTests))}`,inline : true},
            {name :'Population', value:`${data.population}`,inline : true},
            {name :'Infection Rate', value:`${(data.casesPerOneMillion/10000).toFixed(3)}%`,inline : true},
            {name :'Fatality Rate', value:`${(data.deaths/data.cases*100).toFixed(3)}%`,inline : true},
            {name :'Critical Rate', value:`${(data.critical/data.active*100).toFixed(3)}%`,inline : true},
            {name :'Recovery Rate', value:`${(data.recovered/data.active*100).toFixed(3)}%`,inline : true},
            {name :'Test Rate', value:`${(data.testsPerOneMillion/10000).toFixed(3)}%`,inline : true},
            {name :'infected countries', value:data.affectedCountries ,inline : true},
        ],
        url :'https://github.com/theStonedSage' 
    })
    await message.channel.send(embed);
}

//country
async function country(message,args){

    if(args.length<1) return await message.channel.send("give some country name"); 
    const data = await api.countries({country : args.join(' ') });
    const prevdata = await api.yesterday.countries({country : args.join(' ')});
    data.todayActive = data.active - prevdata.active;
    data.todayrec = data.recovered - prevdata.recovered;
    data.totalcritical = data.critical - prevdata.critical;
    data.todayTests = data.tests - prevdata.tests;
    //everything is same except this time the data is of a country
    const embed = newEmbed({
        color:'#022c43',
        author:{name : "Covid stats", url: 'https://cdn.discordapp.com/icons/707227171835609108/f308f34a45ac7644506fb628215a3793.png?size=128' },
        description : "this is the help section",
        title:"Global data",
        fields:[
            {name :'cases', value:`${data.cases}\n${(data.todayCases>=0?'+':'-')+String(Math.abs(data.todayCases))}`,inline : true},
            {name :'deaths', value:`${data.deaths}\n${(data.todayDeaths>=0?'+':'-')+String(Math.abs(data.todayDeaths))}`,inline : true},
            {name :'Active', value:`${data.active}\n${(data.todayActive>=0?'+':'-')+String(Math.abs(data.todayActive))}`,inline : true},
            {name :'Recovered', value:`${data.recovered}\n${(data.todayrec>=0?'+':'-')+String(Math.abs(data.todayrec))}`,inline : true},
            {name :'Critical', value:`${data.critical}\n${(data.totalcritical>=0?'+':'-')+String(Math.abs(data.totalcritical))}`,inline : true},
            {name :'Tests', value:`${data.tests}\n${(data.todayTests>=0?'+':'-')+String(Math.abs(data.todayTests))}`,inline : true},
            {name :'Population', value:`${data.population}`,inline : true},
            {name :'Infection Rate', value:`${(data.casesPerOneMillion/10000).toFixed(3)}%`,inline : true},
            {name :'Fatality Rate', value:`${(data.deaths/data.cases*100).toFixed(3)}%`,inline : true},
            {name :'Critical Rate', value:`${(data.critical/data.active*100).toFixed(3)}%`,inline : true},
            {name :'Recovery Rate', value:`${(data.recovered/data.active*100).toFixed(3)}%`,inline : true},
            {name :'Test Rate', value:`${(data.testsPerOneMillion/10000).toFixed(3)}%`,inline : true},
        ],
        url :'https://github.com/theStonedSage' 
    })
    await message.channel.send(embed);
}

async function state(message,args){
    if(args.length<1) return await message.channel.send("give a state name");
    //same as country but the data will be of a state
    const data = await api.states({state : args.join(' ') });
    const prevdata = await api.yesterday.states({state : args.join(' ')});
    data.todayActive = data.active - prevdata.active;
    data.todayrec = data.recovered - prevdata.recovered;
    data.totalcritical = data.critical - prevdata.critical;
    data.todayTests = data.tests - prevdata.tests;
    //everything is same except this time the data is of a country
    const embed = newEmbed({
        color:'#022c43',
        author:{name : "Covid stats", url: 'https://cdn.discordapp.com/icons/707227171835609108/f308f34a45ac7644506fb628215a3793.png?size=128' },
        description : "this is the help section",
        title:"Global data",
        fields:[
            {name :'cases', value:`${data.cases}\n${(data.todayCases>=0?'+':'-')+String(Math.abs(data.todayCases))}`,inline : true},
            {name :'deaths', value:`${data.deaths}\n${(data.todayDeaths>=0?'+':'-')+String(Math.abs(data.todayDeaths))}`,inline : true},
            {name :'Active', value:`${data.active}\n${(data.todayActive>=0?'+':'-')+String(Math.abs(data.todayActive))}`,inline : true},
            {name :'Tests', value:`${data.tests}\n${(data.todayTests>=0?'+':'-')+String(Math.abs(data.todayTests))}`,inline : true},
            {name :'Test Rate', value:`${(data.testsPerOneMillion/10000).toFixed(3)}%`,inline : true},
        ],
        url :'https://github.com/theStonedSage' 
    })
    await message.channel.send(embed);

}

async function rankings(message,args){
    const data = await api.all();
    const countries = (await api.countries({sort:'cases'})).splice(0,10);
    var countrylist =[];
    countries.forEach(c => {
        countrylist.push({
            name : c.country,
            value : c.cases
        })
    });
    const embed =newEmbed({
        color:'#022c43',
        author:{name : "Covid stats", url: 'https://cdn.discordapp.com/icons/707227171835609108/f308f34a45ac7644506fb628215a3793.png?size=128' },
        description : "this is the help section",
        title:"Top 15 countries sorted by cases",
        fields:countrylist,
        url :'https://github.com/theStonedSage' 
    })
    await message.channel.send(embed);
}

async function compare(message,args){
    if(args.length<2) return await message.channel.send("please privide two countries");
    args = args.splice(0, 2)
    const yesterday = await api.yesterday.countries({ country: args})
  let data = await api.countries({ country: args })
  if (data.find(c => c.message)) 
    return await message.channel.send(data.map(c => c.message).filter(x => x))
  data = data.map((country, i) => ({
    ...country,
    todayActives: country.active - yesterday[i].active,
    todayRecovereds: country.recovered - yesterday[i].recovered,
    todayCriticals: country.critical - yesterday[i].critical,
    todayTests: country.tests - yesterday[i].tests,
  }))
  const embed = newEmbed({
    color: '#303136', 
    author: { name: 'COVID Stats ', url: 'https://cdn.discordapp.com/icons/707227171835609108/f308f34a45ac7644506fb628215a3793.png?size=128' },
    title: `Comparison between ${data[0].country} & ${data[1].country}`,
    fields: [
      { name: 'Cases', value: `**${data[0].country}**: ${(data[0].cases)} (${(data[0].todayCases >= 0 ? "+":"-")+String(Math.abs(data[0].todayCases))})\n**${data[1].country}**: ${(data[1].cases)} (${(data[1].todayCases >= 0 ? "+":"-")+String(Math.abs(data[1].todayCases))})`, inline: true },
      { name: 'Deaths', value: `**${data[0].country}**: ${(data[0].deaths)} (${(data[0].todayDeaths >= 0 ? "+":"-")+String(Math.abs(data[0].todayDeaths))})\n**${data[1].country}**: ${(data[1].deaths)} (${(data[1].todayDeaths >= 0 ? "+":"-")+String(Math.abs(data[1].todayDeaths))})`, inline: true },
      { name: 'Active', value: `**${data[0].country}**: ${(data[0].active)} (${(data[0].todayActives >= 0 ? "+":"-")+String(Math.abs(data[0].todayActives))})\n**${data[1].country}**: ${(data[1].active)} (${(data[1].todayActives >= 0 ? "+":"-")+String(Math.abs(data[1].todayActives))})`, inline: true },
      { name: 'Recovered', value: `**${data[0].country}**: ${(data[0].recovered)} (${(data[0].todayRecovereds >= 0 ? "+":"-")+String(Math.abs(data[0].todayRecovereds))})\n**${data[1].country}**: ${(data[1].recovered)} (${(data[1].todayRecovereds >= 0 ? "+":"-")+String(Math.abs(data[1].todayRecovereds))})`, inline: true },
      { name: 'Critical', value: `**${data[0].country}**: ${(data[0].critical)} (${(data[0].todayCriticals >= 0 ? "+":"-")+String(Math.abs(data[0].todayCriticals))})\n**${data[1].country}**: ${(data[1].critical)} (${(data[1].todayCriticals >= 0 ? "+":"-")+String(Math.abs(data[1].todayCriticals))})`, inline: true },
      { name: 'Tests', value: `**${data[0].country}**: ${(data[0].tests)} (${(data[0].todayTests >= 0 ? "+":"-")+String(Math.abs(data[0].todayTests))})\n**${data[1].country}**: ${(data[1].tests)} (${(data[1].todayTests >= 0 ? "+":"-")+String(Math.abs(data[1].todayTests))})`, inline: true },
      { name: 'Population', value: `**${data[0].country}**: ${(data[0].population)}\n**${data[1].country}**: ${(data[1].population)}`, inline: true },
      { name: 'Infection Rate', value: `**${data[0].country}**: ${(data[0].casesPerOneMillion/10000).toFixed(4)} %\n**${data[1].country}**: ${(data[1].casesPerOneMillion/10000).toFixed(4)} %`, inline: true },
      { name: 'Fatality Rate', value: `**${data[0].country}**: ${(data[0].deaths/data[0].cases*100).toFixed(4)} %\n**${data[1].country}**: ${(data[1].deaths/data[1].cases*100).toFixed(4)} %`, inline: true },
      { name: 'Critical Rate', value: `**${data[0].country}**: ${(data[0].critical/data[0].active*100).toFixed(4)} %\n**${data[1].country}**: ${(data[1].critical/data[1].active*100).toFixed(4)} %`, inline: true },
      { name: 'Recovery Rate', value: `**${data[0].country}**: ${(data[0].recovered/data[0].cases*100).toFixed(4)} %\n**${data[1].country}**: ${(data[1].recovered/data[1].cases*100).toFixed(4)} %`, inline: true },
      { name: 'Test Rate', value: `**${data[0].country}**: ${(data[0].testsPerOneMillion/10000).toFixed(4)} %\n**${data[1].country}**: ${(data[1].testsPerOneMillion/10000).toFixed(4)} %`, inline: true },
    ],
    url: 'https://github.com/theStonedSage'
  })
  await message.channel.send(embed)

    
}

//CHARTS <3
const config = ChartJS=>{
    ChartJS.defaults.global.defaultFontColor='#fff'
    ChartJS.defaults.global.defaultFontStyle='bold'
    ChartJS.defaults.global.defaultFontFamily='Helvetica Neue, Helvetica, Arial, sans-serif'
    ChartJS.plugins.register({
        beforInit:function(chart){
            chart.legend.afterFit = function() {this.height +=35}
        },
        beforeDraw:(chart)=>{
            const ctx = chart.ctx;
            ctx.save();
            ctx.fillStyle = '#2f3136';
            ctx.fillRect(0,0,chart.width,chart.height);
            ctx.restore();
        }
    })
}

//config done

const lineRenderer = new CanvasRenderService(1200,600,config);
const pieRenderer = new CanvasRenderService(750,600,config);

async function graph(message,args){
    if(args.length<1) return await message.channel.send("specify a country name");
    const lineData = ['global', 'all'].includes(args[0].toLowerCase()) ? {timeline: await api.historical.all({days: -1})} : await api.historical.countries({ country: args[0], days: -1 })
    const datasets = [{
        label : "cases",
        borderColor: '#ffffff',
        pointBackgroundColor : '#ffffff',
        pointRadius : 2,
        pointWidth: 3,
        data: Object.values(lineData.timeline.cases),
    },
    {
        label : "deaths",
        borderColor: '#e14594',
        pointBackgroundColor : '#e14594',
        pointRadius : 2,
        pointWidth: 3,
        data: Object.values(lineData.timeline.deaths),
    },
    {
        label : "Active",
        borderColor: '#a7d129',
        pointBackgroundColor : '#a7d129',
        pointRadius : 2,
        pointWidth: 3,
        data: Object.keys(lineData.timeline.cases).map(key=>lineData.timeline.cases[key]-lineData.timeline.recovered[key] - lineData.timeline.deaths[key]),
    },
    ]

    const buffer = await lineRenderer.renderToBuffer({
        type:'line',
        data: {
            labels:Object.keys(lineData.timeline.cases),
            datasets: datasets.filter(d=>d.data.filter(x=>x).length),
        },
        options : {
            scales : {
                xAxes :[{
                    display:true,
                    tricks:{
                        fontSize:18,
                        callback: (label)=> moment(label,'M/D/YY').format('DD MMM'),
                        padding : 10 
                    },
                    gridlines: {
                        zeroLineColor: '#fff',
                        zeroLineWidth: 2
                    }
                }],
                yAxes :[{
                    display:true,
                    type : args[args.length-1]==='log'?'logarithmic':'linear',
                    tricks:{
                        fontSize:18,
                    },
                    gridlines: {
                        zeroLineColor: '#fff',
                        zeroLineWidth: 2
                    }
                }]
            },
            legend: {
                display: true,
                labels:{
                    usePointStyle : true,
                    padding: 40,
                    fontSize: 30,
                }
            }
        } 
    })

    const embed = newEmbed({
        color: '#303136',
        author:{name : "Covid stats", url: 'https://cdn.discordapp.com/icons/707227171835609108/f308f34a45ac7644506fb628215a3793.png?size=128' },
        title : `${lineData.country||'Global'} Timeline`,
        description: 'data is provided by the novelCovid api',
        files: [new Discord.MessageAttachment(buffer,'graph.png')],
        image: 'attachment://graph.png',
        url :'https://github.com/theStonedSage' 
    })

    await message.channel.send(embed);
}

async function overview(message,args){
    if(args.length<1) return await message.channel.send("specify a country name");
    const pieData = ['global','all'].includes(args[0].toLowerCase())? await api.all() : await api.countries({country:args[0]});
    const buffer = await lineRenderer.renderToBuffer({
        type:'pie',
        data: {
            labels:['Active','Recovered','Deaths'],
            datasets: [{
                data: [pieData.active,pieData.recovered,pieData.deaths],
                backgroundColor: ['#fecb89', '#a7d129', '#e14594'],
                borderWidth:1,
                borderColor: ['#fecb89', '#a7d129', '#e14594']
            }],
        },
        options : {
            legend: {
                display: true,
                labels:{
                    padding: 40,
                    fontSize: 30,
                }
            }
        } 
    })

    const embed = newEmbed({
        color: '#303136',
        author:{name : "Covid stats", url: 'https://cdn.discordapp.com/icons/707227171835609108/f308f34a45ac7644506fb628215a3793.png?size=128' },
        title: `${pieData.country||'Global'} Overview`,
        files: [new Discord.MessageAttachment(buffer,'graph.png')],
        image: 'attachment://graph.png',
        url :'https://github.com/theStonedSage',
    })

    await message.channel.send(embed);
}

module.exports = {
    help,
    h : help,
    all,
    a:all,
    country,
    c: country,
    state,
    s: state,
    rankings,
    r:rankings,
    compare,
    comp : compare,
    graph,
    g : graph,
    overview,
    o: overview
}