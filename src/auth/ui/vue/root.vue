<template>
    <!-- 
        HACK: Want to prefetch images but <link ref="prefetch"> does not work.
        We use <img> instead but hide it.
     -->
    <img
        v-show="false"
        src="https://github.com/aws/aws-toolkit-vscode/raw/HEAD/docs/marketplace/vscode/CC_dev_env.gif"
    />
    <img
        v-show="false"
        src="https://github.com/aws/aws-toolkit-vscode/raw/HEAD/docs/marketplace/vscode/awsExplorer.gif"
    />
    <img
        v-show="false"
        src="https://github.com/aws/aws-toolkit-vscode/raw/HEAD/docs/marketplace/vscode/codewhisperer.gif"
    />

    <div style="display: flex; flex-direction: column; gap: 10px; padding-top: 5px">
        <!-- Status Bars -->
        <div
            v-if="successfulAuthConnection || foundCredentialButNotConnected"
            style="display: flex; flex-direction: column; gap: 20px"
        >
            <div
                v-if="successfulAuthConnection"
                class="border-common"
                style="
                    width: fit-content;
                    white-space: nowrap;
                    display: flex;
                    flex-direction: row;
                    background-color: #28632b;
                    padding: 10px;
                "
            >
                <div class="icon icon-lg icon-vscode-check" style="color: #ffffff"></div>
                &nbsp; &nbsp;
                <div style="display: flex; flex-direction: row; color: #ffffff">
                    Connected to&nbsp;<span style="font-weight: bold; color: #ffffff">{{ authFormDisplayName() }}</span
                    >! See connections in the&nbsp;<a
                        v-on:click="showConnectionQuickPick()"
                        style="cursor: pointer; color: rgb(147, 196, 255)"
                        >Toolkit panel</a
                    >.
                </div>
                &nbsp;&nbsp;
                <div
                    v-on:click="closeStatusBar"
                    style="cursor: pointer; color: #ffffff"
                    class="icon icon-lg icon-vscode-chrome-close"
                ></div>
            </div>
            <div
                v-if="foundCredentialButNotConnected"
                class="border-common"
                style="
                    width: fit-content;
                    white-space: nowrap;
                    display: flex;
                    flex-direction: row;
                    background-color: #28632b;
                    padding: 10px;
                "
            >
                <div class="icon icon-lg icon-vscode-check" style="color: #ffffff"></div>
                &nbsp; &nbsp;
                <div style="display: flex; flex-direction: row; color: #ffffff">
                    IAM Credentials detected, select one in the&nbsp;<a
                        v-on:click="showConnectionQuickPick()"
                        style="cursor: pointer; color: rgb(147, 196, 255)"
                        >Toolkit panel</a
                    >&nbsp;to enable the AWS Explorer.
                </div>
                &nbsp;&nbsp;
                <div
                    v-on:click="closeFoundCredentialStatusBar()"
                    style="cursor: pointer; color: #ffffff"
                    class="icon icon-lg icon-vscode-chrome-close"
                ></div>
            </div>
        </div>
        <div style="display: flex; flex-direction: row; gap: 10px; margin-top: 10px">
            <div id="left-side" :style="{ display: 'flex', flexDirection: 'column', gap: '10px' }">
                <!-- Logo + Title -->
                <div>
                    <div style="display: flex; justify-content: left; align-items: center; gap: 10px">
                        <div id="logo">
                            <svg
                                id="Layer_1"
                                data-name="Layer 1"
                                xmlns="http://www.w3.org/2000/svg"
                                width="52pt"
                                height="32pt"
                                viewBox="0 0 50 30"
                            >
                                <path
                                    d="M14.09,10.85a4.7,4.7,0,0,0,.19,1.48,7.73,7.73,0,0,0,.54,1.19.77.77,0,0,1,.12.38.64.64,0,0,1-.32.49l-1,.7a.83.83,0,0,1-.44.15.69.69,0,0,1-.49-.23,3.8,3.8,0,0,1-.6-.77q-.25-.42-.51-1a6.14,6.14,0,0,1-4.89,2.3,4.54,4.54,0,0,1-3.32-1.19,4.27,4.27,0,0,1-1.22-3.2A4.28,4.28,0,0,1,3.61,7.75,6.06,6.06,0,0,1,7.69,6.46a12.47,12.47,0,0,1,1.76.13q.92.13,1.91.36V5.73a3.65,3.65,0,0,0-.79-2.66A3.81,3.81,0,0,0,7.86,2.3a7.71,7.71,0,0,0-1.79.22,12.78,12.78,0,0,0-1.79.57,4.55,4.55,0,0,1-.58.22l-.26,0q-.35,0-.35-.52V2a1.09,1.09,0,0,1,.12-.58,1.2,1.2,0,0,1,.47-.35A10.88,10.88,0,0,1,5.77.32,10.19,10.19,0,0,1,8.36,0a6,6,0,0,1,4.35,1.35,5.49,5.49,0,0,1,1.38,4.09ZM7.34,13.38a5.36,5.36,0,0,0,1.72-.31A3.63,3.63,0,0,0,10.63,12,2.62,2.62,0,0,0,11.19,11a5.63,5.63,0,0,0,.16-1.44v-.7a14.35,14.35,0,0,0-1.53-.28,12.37,12.37,0,0,0-1.56-.1,3.84,3.84,0,0,0-2.47.67A2.34,2.34,0,0,0,5,11a2.35,2.35,0,0,0,.61,1.76A2.4,2.4,0,0,0,7.34,13.38Zm13.35,1.8a1,1,0,0,1-.64-.16,1.3,1.3,0,0,1-.35-.65L15.81,1.51a3,3,0,0,1-.15-.67.36.36,0,0,1,.41-.41H17.7a1,1,0,0,1,.65.16,1.4,1.4,0,0,1,.33.65l2.79,11,2.59-11A1.17,1.17,0,0,1,24.39.6a1.1,1.1,0,0,1,.67-.16H26.4a1.1,1.1,0,0,1,.67.16,1.17,1.17,0,0,1,.32.65L30,12.39,32.88,1.25A1.39,1.39,0,0,1,33.22.6a1,1,0,0,1,.65-.16h1.54a.36.36,0,0,1,.41.41,1.36,1.36,0,0,1,0,.26,3.64,3.64,0,0,1-.12.41l-4,12.86a1.3,1.3,0,0,1-.35.65,1,1,0,0,1-.64.16H29.25a1,1,0,0,1-.67-.17,1.26,1.26,0,0,1-.32-.67L25.67,3.64,23.11,14.34a1.26,1.26,0,0,1-.32.67,1,1,0,0,1-.67.17Zm21.36.44a11.28,11.28,0,0,1-2.56-.29,7.44,7.44,0,0,1-1.92-.67,1,1,0,0,1-.61-.93v-.84q0-.52.38-.52a.9.9,0,0,1,.31.06l.42.17a8.77,8.77,0,0,0,1.83.58,9.78,9.78,0,0,0,2,.2,4.48,4.48,0,0,0,2.43-.55,1.76,1.76,0,0,0,.86-1.57,1.61,1.61,0,0,0-.45-1.16A4.29,4.29,0,0,0,43,9.22l-2.41-.76A5.15,5.15,0,0,1,38,6.78a3.94,3.94,0,0,1-.83-2.41,3.7,3.7,0,0,1,.45-1.85,4.47,4.47,0,0,1,1.19-1.37A5.27,5.27,0,0,1,40.51.29,7.4,7.4,0,0,1,42.6,0a8.87,8.87,0,0,1,1.12.07q.57.07,1.08.19t.95.26a4.27,4.27,0,0,1,.7.29,1.59,1.59,0,0,1,.49.41.94.94,0,0,1,.15.55v.79q0,.52-.38.52a1.76,1.76,0,0,1-.64-.2,7.74,7.74,0,0,0-3.2-.64,4.37,4.37,0,0,0-2.21.47,1.6,1.6,0,0,0-.79,1.48,1.58,1.58,0,0,0,.49,1.18,4.94,4.94,0,0,0,1.83.92L44.55,7a5.08,5.08,0,0,1,2.57,1.6A3.76,3.76,0,0,1,47.9,11a4.21,4.21,0,0,1-.44,1.93,4.4,4.4,0,0,1-1.21,1.47,5.43,5.43,0,0,1-1.85.93A8.25,8.25,0,0,1,42.05,15.62Z"
                                />
                                <path
                                    class="cls-1"
                                    d="M45.19,23.81C39.72,27.85,31.78,30,25,30A36.64,36.64,0,0,1,.22,20.57c-.51-.46-.06-1.09.56-.74A49.78,49.78,0,0,0,25.53,26.4,49.23,49.23,0,0,0,44.4,22.53C45.32,22.14,46.1,23.14,45.19,23.81Z"
                                />
                                <path
                                    class="cls-1"
                                    d="M47.47,21.21c-.7-.9-4.63-.42-6.39-.21-.53.06-.62-.4-.14-.74,3.13-2.2,8.27-1.57,8.86-.83s-.16,5.89-3.09,8.35c-.45.38-.88.18-.68-.32C46.69,25.8,48.17,22.11,47.47,21.21Z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h3 style="margin-bottom: 0">AWS Toolkit for VS Code</h3>
                            <h1 style="margin-top: 0">Add Connection to AWS</h1>
                        </div>
                    </div>
                </div>

                <!-- Left side clickable boxes for features/services -->
                <div class="flex-container">
                    <div id="left-column">
                        <div>
                            <h2>Select a feature to add a connection:</h2>
                            <ul class="service-item-list" v-for="item in serviceItems">
                                <ServiceItem
                                    :title="getServiceItemProps(item.id).title"
                                    :description="getServiceItemProps(item.id).description"
                                    :status="item.status"
                                    :isSelected="isServiceSelected(item.id)"
                                    :isLandscape="isLandscape()"
                                    :id="item.id"
                                    :key="buildServiceItemKey(item.id, item.status)"
                                    @service-item-clicked="serviceWasClicked(item.id)"
                                >
                                    <!-- Content window that appears under when in portrait mode -->
                                    <template
                                        v-slot:service-item-content-slot
                                        v-if="isServiceSelected(item.id) && !isLandscape()"
                                    >
                                        <component
                                            :is="getServiceItemContent(item.id)"
                                            :state="serviceItemsAuthStatus[item.id]"
                                            :key="item.id + rerenderContentWindowKey"
                                            @auth-connection-updated="onAuthConnectionUpdated"
                                        ></component>
                                    </template>
                                </ServiceItem>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Content window that appears on the right -->
            <div v-if="isLandscape() && isAnyServiceSelected()" id="right-column">
                <component
                    :is="getServiceItemContent(getSelectedService())"
                    :state="serviceItemsAuthStatus[getSelectedService()]"
                    :key="getSelectedService() + rerenderContentWindowKey"
                    @auth-connection-updated="onAuthConnectionUpdated"
                ></component>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ServiceItem, { ServiceItemsState, ServiceStatus, StaticServiceItemProps } from './serviceItem.vue'
import serviceItemsContent, { serviceItemsAuthStatus } from './serviceItemContent/shared.vue'
import { AuthWebview } from './show'
import { WebviewClientFactory } from '../../../webviews/client'
import { ServiceItemId } from './types'
import { AuthFormDisplayName, AuthFormId } from './authForms/types'
import { ConnectionUpdateArgs } from './authForms/baseAuth.vue'

const client = WebviewClientFactory.create<AuthWebview>()
const serviceItemsState = new ServiceItemsState()

export default defineComponent({
    components: { ServiceItem },
    name: 'AuthRoot',
    data() {
        return {
            unlockedItemIds: [] as ServiceItemId[],
            lockedItemIds: [] as ServiceItemId[],
            currWindowWidth: window.innerWidth,

            serviceItemsAuthStatus: serviceItemsAuthStatus,

            rerenderContentWindowKey: 0,

            successfulAuthConnection: undefined as AuthFormId | undefined,

            foundCredentialButNotConnected: false,
        }
    },
    async created() {
        await this.getAllConnectedAuths().then(connectedAuths => client.setInitialConnectedAuths(connectedAuths))
        this.updateFoundCredentialButNotConnected()

        await this.selectInitialService()
        await this.updateFeatureConnectionStatus()

        // This handles auth changes triggered outside of this webview.
        client.onDidConnectionUpdate(() => {
            this.updateFeatureConnectionStatus()
            // This handles the edge case where we have selected a service item
            // and its content window is being shown. If there is an external
            // event that changes the state of this service (eg: disconnected)
            // this forced rerender will display the new state
            // this.rerenderSelectedContentWindow()
        })
        client.onDidSelectService((id: ServiceItemId) => {
            this.selectService(id)
        })
    },
    mounted() {
        window.addEventListener('resize', this.updateWindowWidth)
    },
    unmounted() {
        window.removeEventListener('resize', this.updateWindowWidth)
    },
    computed: {
        serviceItems(): { status: ServiceStatus; id: ServiceItemId }[] {
            const unlocked = this.unlockedItemIds.map(id => {
                return { status: 'UNLOCKED' as ServiceStatus, id }
            })
            const locked = this.lockedItemIds.map(id => {
                return { status: 'LOCKED' as ServiceStatus, id }
            })
            return [...unlocked, ...locked]
        },
    },
    methods: {
        isLandscape() {
            return this.currWindowWidth > 1170
        },
        isAnyServiceSelected(): boolean {
            return serviceItemsState.selected !== undefined
        },
        /**
         * Triggers a rendering of the service items.
         */
        renderItems() {
            const { unlocked, locked } = serviceItemsState.getServiceIds()
            this.unlockedItemIds = unlocked
            this.lockedItemIds = locked
        },
        isServiceSelected(id: ServiceItemId): boolean {
            return serviceItemsState.selected === id
        },
        getSelectedService(): ServiceItemId {
            return serviceItemsState.selected!
        },
        getServiceItemProps(id: ServiceItemId): StaticServiceItemProps {
            return serviceItemsState.getStaticServiceItemProps(id)
        },
        serviceWasClicked(id: ServiceItemId): void {
            serviceItemsState.toggleSelected(id)
            this.renderItems()
        },
        selectService(id: ServiceItemId) {
            serviceItemsState.select(id)
            this.renderItems()
        },
        /**
         * Builds a unique key for a service item to optimize re-rendering.
         *
         * This allows Vue to know which existing component to compare to the new one.
         * https://vuejs.org/api/built-in-special-attributes.html#key
         */
        buildServiceItemKey(id: ServiceItemId, lockStatus: ServiceStatus) {
            return id + '_' + (this.isServiceSelected(id) ? `${lockStatus}_SELECTED` : `${lockStatus}`)
        },
        updateWindowWidth() {
            this.currWindowWidth = window.innerWidth
        },
        getServiceItemContent(id: ServiceItemId) {
            return serviceItemsContent[id]
        },
        updateServiceLock(id: ServiceItemId, isAuthConnected: boolean) {
            if (isAuthConnected) {
                serviceItemsState.unlock(id)
            } else {
                serviceItemsState.lock(id)
            }
        },
        onAuthConnectionUpdated(id: ServiceItemId, args: ConnectionUpdateArgs) {
            if (args.cause === 'created') {
                // When the auth update is caused by a creation of the auth form
                // there is nothing to update externally since the state hasn't changed.
                return
            }
            if (args.isConnected && args.cause === 'signIn') {
                this.successfulAuthConnection = args.id
                client.authFormSuccess(args.id)
                // On a successful sign in the state of the current content window
                // can change. This forces a rerendering of it to have it load the latest state.
                this.rerenderSelectedContentWindow()
            }

            this.updateServiceLock(id, args.isConnected)
            this.renderItems()
            // In some cases, during the connection process for one auth method,
            // an already connected auth can be disconnected. This refreshes all
            // auths to show the user the latest state of everything.
            this.updateFeatureConnectionStatus()
        },
        async updateFeatureConnectionStatus() {
            const allFeatureUpdates = Object.keys(this.serviceItemsAuthStatus).map(key => {
                const id: ServiceItemId = key as keyof typeof this.serviceItemsAuthStatus

                return this.serviceItemsAuthStatus[id].getConnectedAuth().then(connectedAuth => {
                    client.authFormSuccess(connectedAuth)
                    this.updateServiceLock(id, !!connectedAuth)
                })
            })
            return Promise.all(allFeatureUpdates).then(() => this.renderItems())
        },
        async getAllConnectedAuths(): Promise<AuthFormId[]> {
            const allFeatureStates = Object.keys(this.serviceItemsAuthStatus).map(key => {
                const id: ServiceItemId = key as keyof typeof this.serviceItemsAuthStatus
                return this.serviceItemsAuthStatus[id]
            })
            const connectedAuths: AuthFormId[] = []
            for (const featureState of allFeatureStates) {
                for (const authForm of featureState.getAuthForms()) {
                    if (await authForm.isAuthConnected()) {
                        connectedAuths.push(authForm.id)
                    }
                }
            }
            return connectedAuths
        },
        /**
         * This will trigger a re-rendering of the currently shown content window.
         */
        rerenderSelectedContentWindow() {
            // Arbitrarily toggles value between 0 and 1
            this.rerenderContentWindowKey = this.rerenderContentWindowKey === 0 ? 1 : 0
        },
        async selectInitialService() {
            const initialService = await client.getInitialService()
            if (initialService) {
                this.selectService(initialService)
            }
        },
        showConnectionQuickPick() {
            client.showConnectionQuickPick()
            client.emitUiClick('auth_openConnectionSelector')
        },
        closeStatusBar() {
            this.successfulAuthConnection = undefined
        },
        closeFoundCredentialStatusBar() {
            this.foundCredentialButNotConnected = false
        },
        /**
         * Updates the state of if we detected credentials but the user
         * has not actively selected one.
         */
        async updateFoundCredentialButNotConnected() {
            const isFirstUse = await client.isExtensionFirstUse()
            // Order these are called matters since isCredentialExists() pulls in local credentials
            const isCredentialConnected = await client.isCredentialConnected()
            const isCredentialExists = await client.isCredentialExists()

            if (isFirstUse && (isCredentialConnected || isCredentialExists)) {
                this.foundCredentialButNotConnected = true
            } else {
                this.foundCredentialButNotConnected = false
            }
        },
        authFormDisplayName() {
            if (this.successfulAuthConnection === undefined) {
                return ''
            }
            return AuthFormDisplayName[this.successfulAuthConnection]
        },
    },
})
</script>

<style>
/** By default  */
.flex-container {
    display: flex;
    flex-direction: row;
    gap: 20px;
}

#left-column {
    width: 550px;
    box-sizing: border-box;
    margin-top: 10px;
}

.service-item-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
}

.service-item-list li {
    /* Creates an even separation between all list items*/
    margin-top: 10px;
}

#left-side h1,
#left-side h2,
#left-side h3 {
    margin: 0 0 0 0;
}
</style>
