const { select, input, checkbox } = require('@inquirer/prompts');

let meta = {
    value: "Beber 3lts de água por dia",
    checked: false,
}

let metas = [ meta ]

const cadastrarMeta = async () => {
    const meta = await input({  message: "Digite a meta:" })

    if(meta.length == 0) {
        console.log("A meta não pode ser vazia.")
        return
    }

    metas.push(
        {value: meta, checked: false}
    )
};

const listarMetas = async () => {
    const respostas = await checkbox({
        message:"Use as SETAS para mudar de meta, o ESPAÇO para marcar/desmarcar e o ENTER para finalizar a etapa",
        choices: [...metas],
        instructions: false,
    })

    metas.forEach((qualquerMeta) => {
        qualquerMeta.checked = false
    })

    if(respostas.length == 0){
        console.log("Nenhuma meta selecionada!")
        return
    }

    respostas.forEach((resposta) => {
        const meta = metas.find((qualquerMeta) => {
            return qualquerMeta.value == resposta

        })

        meta.checked = true
    }) 

    console.log("Meta(s) concluída(s) com sucesso.")
};

const metasRealizadas = async () => {
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if(realizadas.length == 0) {
        console.log("Não exite metas finalizadas =( " )
        return
    }

    await select({
        message: "Metas Realizadas: " + realizadas.length ,
        choices: [...realizadas]
    })
};

const metasAbertas = async () => {
    const abertas = metas.filter((meta) => {
        return meta.checked != true 
    })

    if(abertas.length == 0) {
        console.log("Não exite metas em aberto =) ")
        return
    }

    await select({
        message: "Metas Abertas: " + abertas.length,
        choices: [...abertas]
    })
};

const start = async () => {
    while (true) {
        const opcao = await select({
            message: "Menu >",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "cadastrar"
                },   
                {
                    name: "Listar metas",
                    value: "listar"
                },     
                {
                    name: "Metas realizadas",
                    value: "realizadas"
                },   
                {
                    name: "Metas abertas",
                    value: "abertas"
                },   
                {
                    name: "Sair",
                    value: "sair"
                }
            ]
        })

        switch (opcao) {
            case "cadastrar":
                await cadastrarMeta()
                console.log(metas)
                break

            case "listar":
                await listarMetas()
                break

            case "realizadas":
                await metasRealizadas()
                break

            case "abertas":
                await metasAbertas()
                break

            case "sair":
                return
        }
    }
};


start()