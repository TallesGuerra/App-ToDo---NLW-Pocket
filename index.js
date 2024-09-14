const { select, input, checkbox } = require('@inquirer/prompts');
const fs = require("fs").promises

let mensagem = "Seja bem vindo ao App de Metas";

let meta = {
    value: "Beber 3lts de água por dia",
    checked: false,
}

let metas = [meta]

/* 
const carregarMetas = async () => {
    try {
        const dados = await fs.readFile("metas.json", "utf-8")
        metas = JSON.parse(dados)
    }
    catch (erro) { }
}
 */

const cadastrarMeta = async () => {
    const meta = await input({ message: "Digite a meta:" })

    if (meta.length == 0) {
        mensagem = "A meta não pode ser vazia."
        return
    }

    metas.push(
        { value: meta, checked: false }
    )

    mensagem = "Meta cadastrada com sucesso!"
};

const listarMetas = async () => {
    const respostas = await checkbox({
        message: "Use as SETAS para mudar de meta, o ESPAÇO para marcar/desmarcar e o ENTER para finalizar a etapa",
        choices: [...metas],
        instructions: false,
    })

    metas.forEach((qualquerMeta) => {
        qualquerMeta.checked = false
    })

    if (respostas.length == 0) {
        mensagem = "Nenhuma meta selecionada!"
        return
    }

    respostas.forEach((resposta) => {
        const meta = metas.find((qualquerMeta) => {
            return qualquerMeta.value == resposta

        })

        meta.checked = true
    })

    mensagem = "Meta(s) concluída(s) com sucesso."
};

const metasRealizadas = async () => {
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if (realizadas.length == 0) {
        mensagem = "Não exite metas finalizadas =("
        return
    }

    await select({
        message: "Metas Realizadas: " + realizadas.length,
        choices: [...realizadas]
    })
};

const metasAbertas = async () => {
    const abertas = metas.filter((meta) => {
        return meta.checked != true
    })

    if (abertas.length == 0) {
        mensagem = "Não exite metas em aberto =) "
        return
    }

    await select({
        message: "Metas Abertas: " + abertas.length,
        choices: [...abertas]
    })
};

const deletarMetas = async () => {
    if (metas.length == 0) {
        mensagem = "Não existem metas!"
        return
    }

    const metasDesmarcadas = metas.map((meta) => {
        return { value: meta.value, checked: false }
    })

    const itemsADeletar = await checkbox({
        message: "Selecione item para deletar",
        choices: [...metasDesmarcadas],
        instructions: false,
    })

    if (itemsADeletar.length == 0) {
        mensagem = "Nenhum item para deletar!"
        return
    }

    itemsADeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        })
    })

    mensagem = "Meta(s) deleta(s) com sucesso!"
}

const start = async () => {
    while (true) {
        mostrarMensagem()

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
                    name: "Deletar metas",
                    value: "deletar"
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

            case "deletar":
                await deletarMetas()
                break

            case "sair":
                mensagem = "Até a próxima =D" 
                return
        }
    }
};

const mostrarMensagem = () => {
    console.clear();

    if (mensagem != "") {
        console.log(mensagem) //imprime a msg
        console.log("") // quebra de linha
        mensagem = "" // volta para mensagem vazia
    }
};

start()