job "deploy-dashboard-stage" {
    datacenters = ["ator-fin"]
    type = "batch"

    reschedule {
        attempts = 0
    }

    task "deploy-dashboard-task" {
        driver = "docker"

        config {
            image = "ghcr.io/ator-development/ator-dashboard:[[.deploy]]"
            entrypoint = ["yarn"]
            command = "deploy"
            args = []
            volumes = [
                "local/app.config.ts:/usr/src/app/app.config.ts"
            ]
        }

        vault {
            policies = ["dashboard-stage"]
        }

        template {
            data = <<EOH
            {{with secret "kv/dashboard/stage"}}
                PERMAWEB_KEY="{{.Data.data.DASHBOARD_OWNER_KEY}}"
            {{end}}
            EOH
            destination = "secrets/file.env"
            env         = true
        }

        template {
            data = <<EOH
const uniswapBaseUrl = 'https://app.uniswap.org'
const dexscreenerBaseUrl = 'https://dexscreener.com/ethereum'

const contracts = {
  relayRegistry: 'R5PXlkYsP5HYVCzGhF9xzZXQqBog3KrRchp47aa5e3w',
  erc20: '0x0f7b3f5a8fed821c5eb60049538a548db2d479ce',
  uniswapPair: '0xa7480AAfA8AD2af3ce24Ac6853F960AE6Ac7F0c4'
}

export default defineAppConfig({
  arweave: {
    gateway: 'https://arweave.net'
  },
  ator: {
    metricsDeployer: 'guDw5nBzO2zTpuYMnxkSpQ2qCQjL8gxB34GjPpZ2qpY'
  },
  contracts,
  links: {
    dexscreener: `${dexscreenerBaseUrl}/${contracts.uniswapPair}`,
    uniswap: `${uniswapBaseUrl}/#/swap?outputCurrency=${contracts.erc20}`
  },
  welcomeDialogUpdated: 1685010992249
})
            EOH
            destination = "local/app.config.ts"
            env         = false
        }

        restart {
            attempts = 0
            mode = "fail"
        }

        resources {
            cpu    = 4096
            memory = 4096
        }
    }
}