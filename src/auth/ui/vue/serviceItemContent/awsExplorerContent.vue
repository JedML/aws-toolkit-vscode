<template>
    <div class="service-item-content-container border-common" v-show="isAllAuthsLoaded">
        <div class="service-item-content-container-title">AWS Explorer</div>

        <div class="centered-items">
            <img
                class="service-item-content-image"
                src="https://github.com/aws/aws-toolkit-vscode/raw/HEAD/docs/marketplace/vscode/awsExplorer.gif"
                alt="AWS Explorer example GIF"
            />
        </div>

        <div>
            Add multiple IAM Roles to work across AWS Accounts. Manage and edit S3 files, view CloudWatch Logs, Debug
            Lambda Functions, and more!
        </div>

        <div>
            <a
                href="https://docs.aws.amazon.com/toolkit-for-vscode/latest/userguide/toolkit-navigation.html"
                v-on:click="emitUiClick('auth_learnMoreAWSResources')"
                >Learn more about the AWS Explorer.</a
            >
        </div>

        <hr />

        <div v-if="isAuthConnected" class="service-item-content-form-section">
            <ExplorerAggregateForm
                :identityCenterState="identityCenterFormState"
                :credentialsState="credentialsFormState"
                @auth-connection-updated="onAuthConnectionUpdated"
            ></ExplorerAggregateForm>

            <div v-on:click="toggleShowIdentityCenter" style="cursor: pointer; display: flex; flex-direction: row">
                <div
                    style="font-weight: bold; font-size: medium"
                    :class="collapsibleClass(isIdentityCenterShown)"
                ></div>
                <div>
                    <div style="font-weight: bold; font-size: 14px">Add another IAM Identity Center Profile</div>
                </div>
            </div>

            <IdentityCenterForm
                :state="identityCenterFormState"
                @auth-connection-updated="onAuthConnectionUpdated"
                :checkIfConnected="false"
                v-show="isIdentityCenterShown"
            ></IdentityCenterForm>

            <div v-on:click="toggleShowCredentials" style="cursor: pointer; display: flex; flex-direction: row">
                <div style="font-weight: bold; font-size: medium" :class="collapsibleClass(isCredentialsShown)"></div>
                <div>
                    <div style="font-weight: bold; font-size: 14px">Add another IAM User Credential</div>
                </div>
            </div>

            <CredentialsForm
                :state="credentialsFormState"
                :check-if-connected="false"
                @auth-connection-updated="onAuthConnectionUpdated"
                v-show="isCredentialsShown"
            ></CredentialsForm>

            <div>
                Don't have an AWS account?
                <a href="https://aws.amazon.com/free/" v-on:click="emitUiClick('auth_signUpForFree')"
                    >Sign up for free.</a
                >
            </div>
        </div>
        <div v-else class="service-item-content-form-section">
            <IdentityCenterForm
                :state="identityCenterFormState"
                @auth-connection-updated="onAuthConnectionUpdated"
                :checkIfConnected="false"
            ></IdentityCenterForm>

            <div v-on:click="toggleShowCredentials" style="cursor: pointer; display: flex; flex-direction: row">
                <div style="font-weight: bold; font-size: medium" :class="collapsibleClass(isCredentialsShown)"></div>
                <div>
                    <div style="font-weight: bold; font-size: 14px">Or add IAM User Credentials</div>
                </div>
            </div>

            <CredentialsForm
                :state="credentialsFormState"
                @auth-connection-updated="onAuthConnectionUpdated"
                v-show="isCredentialsShown"
            ></CredentialsForm>

            <div>
                Don't have an AWS account?
                <a href="https://aws.amazon.com/free/" v-on:click="emitUiClick('auth_signUpForFree')"
                    >Sign up for free.</a
                >
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CredentialsForm, { CredentialsState } from '../authForms/manageCredentials.vue'
import IdentityCenterForm, { ExplorerIdentityCenterState } from '../authForms/manageIdentityCenter.vue'
import BaseServiceItemContent from './baseServiceItemContent.vue'
import authFormsState, { AuthForm, FeatureStatus } from '../authForms/shared.vue'
import { AuthFormId } from '../authForms/types'
import { ConnectionUpdateArgs } from '../authForms/baseAuth.vue'
import ExplorerAggregateForm from '../authForms/manageExplorer.vue'
import { WebviewClientFactory } from '../../../../webviews/client'
import { AuthWebview } from '../show'

const client = WebviewClientFactory.create<AuthWebview>()

export default defineComponent({
    name: 'AwsExplorerContent',
    components: { CredentialsForm, IdentityCenterForm, ExplorerAggregateForm },
    extends: BaseServiceItemContent,
    data() {
        return {
            isAllAuthsLoaded: false,
            isLoaded: {
                credentials: false,
                identityCenterExplorer: false,
                aggregateExplorer: false,
            } as Record<AuthFormId, boolean>,
            isCredentialsShown: false,
            isIdentityCenterShown: false,
            isAuthConnected: false,
        }
    },
    async created() {
        this.isAuthConnected = await this.state.hasConnectedAuth()
        if (!this.isAuthConnected) {
            // This does not get loaded at all when auth is not connected
            // so we'll mark it as loaded as to not block the overall loading
            this.isLoaded.aggregateExplorer = true
        }
    },
    computed: {
        credentialsFormState(): CredentialsState {
            return authFormsState.credentials
        },
        identityCenterFormState(): ExplorerIdentityCenterState {
            return authFormsState.identityCenterExplorer
        },
    },
    methods: {
        updateIsAllAuthsLoaded() {
            const hasUnloaded = Object.values(this.isLoaded).filter(val => !val).length > 0
            this.isAllAuthsLoaded = !hasUnloaded
        },
        async onAuthConnectionUpdated(args: ConnectionUpdateArgs) {
            this.isLoaded[args.id] = true
            this.updateIsAllAuthsLoaded()
            this.emitAuthConnectionUpdated('awsExplorer', args)
        },
        toggleShowCredentials() {
            this.isCredentialsShown = !this.isCredentialsShown
            if (this.isCredentialsShown) {
                client.emitUiClick('auth_explorer_expandIAMCredentials')
            }
        },
        toggleShowIdentityCenter() {
            this.isIdentityCenterShown = !this.isIdentityCenterShown
            if (this.isIdentityCenterShown) {
                client.emitUiClick('auth_explorer_expandIAMIdentityCenter')
            }
        },
        collapsibleClass(isShown: boolean): string {
            return isShown ? 'icon icon-vscode-chevron-down' : 'icon icon-vscode-chevron-right'
        },
    },
})

export class ResourceExplorerContentState extends FeatureStatus {
    getAuthForms(): AuthForm[] {
        return [authFormsState.credentials, authFormsState.identityCenterExplorer]
    }
}
</script>

<style>
@import './baseServiceItemContent.css';
@import '../shared.css';
</style>
