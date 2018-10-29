import tl = require('vsts-task-lib/task');
import path = require('path');
import { TaskParameters, TaskParametersUtility } from './TaskParameters';
import { AzureRmWebAppDeploymentProvider } from './AzureRmWebAppDeploymentProvider';
import * as Endpoint from 'azurermdeploycommon/azure-arm-rest/azure-arm-endpoint';

async function main() {
    let isDeploymentSuccess: boolean = true;

    try {
        tl.setResourcePath(path.join( __dirname, 'task.json'));
        var taskParams: TaskParameters = await TaskParametersUtility.getParameters();
        var deploymentProvider = new AzureRmWebAppDeploymentProvider(taskParams);

        tl.debug("Predeployment Step Started");
        await deploymentProvider.PreDeploymentStep();

        tl.debug("Deployment Step Started");
        await deploymentProvider.DeployWebAppStep();
    }
    catch(error) {
        tl.debug("Deployment Failed with Error: " + error);
        isDeploymentSuccess = false;
        tl.setResult(tl.TaskResult.Failed, error);
    }
    finally {
        if(deploymentProvider != null) {
            await deploymentProvider.UpdateDeploymentStatus(isDeploymentSuccess);
        }
        
        Endpoint.dispose();
        tl.debug(isDeploymentSuccess ? "Deployment Succeded" : "Deployment failed");

    }
}

main();
