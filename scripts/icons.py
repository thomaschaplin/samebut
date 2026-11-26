"""
Copies the icons we use out of the official provider icon packs into public/icons.

Usage: python3 -I scripts/icons.py <dir with extracted packs: aws/ azure/ gcp-core/ gcp-legacy/>

Download the packs from:
  AWS:   https://aws.amazon.com/architecture/icons/
  Azure: https://learn.microsoft.com/azure/architecture/icons/
  GCP:   https://cloud.google.com/icons (core products + legacy icons)

None means "no fitting official icon": the UI falls back to the provider logo.
"""
import glob, os, shutil, sys

ICONS = {
    # id: (aws Arch_<name>_64.svg, gcp "core:<Dir>" or legacy <name>, azure *-icon-service-<name>.svg)
    "virtual-machines": ("Amazon-EC2", "core:Compute Engine", "Virtual-Machine"),
    "autoscaling": ("Amazon-EC2-Auto-Scaling", "core:Compute Engine", "VM-Scale-Sets"),
    "paas-web-apps": ("AWS-Elastic-Beanstalk", "app_engine", "App-Services"),
    "batch": ("AWS-Batch", "batch", "Batch-Accounts"),
    "hybrid": ("AWS-Outposts-family", "core:Distributed Cloud", "Azure-Local"),
    "functions": ("AWS-Lambda", "cloud_functions", "Function-Apps"),
    "serverless-containers": ("AWS-Fargate", "core:Cloud Run", "Container-Apps-Environments"),
    "workflows": ("AWS-Step-Functions", "workflows", "Logic-Apps"),
    "kubernetes": ("Amazon-Elastic-Kubernetes-Service", "core:GKE", "Kubernetes-Services"),
    "container-registry": ("Amazon-Elastic-Container-Registry", "artifact_registry", "Container-Registries"),
    "object-storage": ("Amazon-Simple-Storage-Service", "core:Cloud Storage", "Storage-Accounts"),
    "block-storage": ("Amazon-Elastic-Block-Store", "core:Hyperdisk", "Disks"),
    "file-storage": ("Amazon-EFS", "filestore", "Azure-Fileshares"),
    "backup": ("AWS-Backup", None, "Backup-Vault"),
    "data-transfer-device": ("AWS-Snowball", "transfer_appliance", "Data-Box"),
    "relational": ("Amazon-RDS", "core:Cloud SQL", "SQL-Database"),
    "cloud-native-relational": ("Amazon-Aurora", "core:AlloyDB", "SQL-Database"),
    "distributed-sql": ("Amazon-Aurora", "core:Cloud Spanner", "Azure-Cosmos-DB"),
    "key-value": ("Amazon-DynamoDB", "firestore", "Azure-Cosmos-DB"),
    "wide-column": ("Amazon-Keyspaces", "bigtable", "Managed-Instance-Apache-Cassandra"),
    "mongodb": ("Amazon-DocumentDB", "firestore", "Azure-Cosmos-DB"),
    "cache": ("Amazon-ElastiCache", "memorystore", "Azure-Managed-Redis"),
    "graph": ("Amazon-Neptune", "core:Cloud Spanner", "Azure-Cosmos-DB"),
    "data-warehouse": ("Amazon-Redshift", "core:BigQuery", "Azure-Synapse-Analytics"),
    "vpc": ("Amazon-Virtual-Private-Cloud", "virtual_private_cloud", "Virtual-Networks"),
    "load-balancer": ("Elastic-Load-Balancing", "cloud_load_balancing", "Load-Balancers"),
    "cdn": ("Amazon-CloudFront", "cloud_cdn", "Front-Door-and-CDN-Profiles"),
    "dns": ("Amazon-Route-53", "cloud_dns", "DNS-Zones"),
    "dedicated-link": ("AWS-Direct-Connect", "cloud_interconnect", "ExpressRoute-Circuits"),
    "vpn": ("AWS-Site-to-Site-VPN", "cloud_vpn", "Virtual-Network-Gateways"),
    "private-endpoint": ("AWS-PrivateLink", "private_service_connect", "Private-Link"),
    "api-gateway": ("Amazon-API-Gateway", "core:Apigee", "API-Management-Services"),
    "queue": ("Amazon-Simple-Queue-Service", "pubsub", "Azure-Service-Bus"),
    "pubsub": ("Amazon-Simple-Notification-Service", "pubsub", "Azure-Service-Bus"),
    "event-bus": ("Amazon-EventBridge", "eventarc", "Event-Grid-Topics"),
    "streaming": ("Amazon-Kinesis-Data-Streams", "pubsub", "Event-Hubs"),
    "kafka": ("Amazon-Managed-Streaming-for-Apache-Kafka", None, "Event-Hubs"),
    "email": ("Amazon-Simple-Email-Service", None, "Azure-Communication-Services"),
    "etl": ("AWS-Glue", "dataflow", "Data-Factories"),
    "spark-hadoop": ("Amazon-EMR", "dataproc", None),
    "query-lake": ("Amazon-Athena", "core:BigQuery", "Azure-Synapse-Analytics"),
    "stream-processing": ("Amazon-Managed-Service-for-Apache-Flink", "dataflow", "Stream-Analytics-Jobs"),
    "bi": ("Amazon-Quick", "core:Looker", "Power-BI-Embedded"),
    "search": ("Amazon-OpenSearch-Service", "core:Vertex AI", "Cognitive-Search"),
    "governance": ("AWS-Lake-Formation", "dataplex", None),
    "ml-platform": ("Amazon-SageMaker-AI", "core:Vertex AI", "Azure-Machine-Learning"),
    "genai": ("Amazon-Bedrock", "core:Vertex AI", "AI-Foundry"),
    "document-ai": ("Amazon-Textract", "document_ai", "Form-Recognizers"),
    "vision": ("Amazon-Rekognition", "cloud_vision_api", "Computer-Vision"),
    "speech": ("Amazon-Transcribe", "speech-to-text", "Speech-Services"),
    "iam": ("AWS-Identity-and-Access-Management", "identity_and_access_management", "Entra-Identity-Roles-and-Administrators"),
    "workforce-identity": ("AWS-IAM-Identity-Center", None, None),
    "customer-identity": ("Amazon-Cognito", "identity_platform", "external-id"),
    "kms": ("AWS-Key-Management-Service", "key_management_service", "Key-Vaults"),
    "secrets": ("AWS-Secrets-Manager", "secret_manager", "Key-Vaults"),
    "waf": ("AWS-WAF", "cloud_armor", "Web-Application-Firewall-Policies(WAF)"),
    "threat-detection": ("Amazon-GuardDuty", "core:Security Command Center", "Microsoft-Defender-for-Cloud"),
    "org-structure": ("AWS-Organizations", None, "Management-Groups"),
    "monitoring": ("Amazon-CloudWatch", "cloud_monitoring", "Monitor"),
    "logging": ("Amazon-CloudWatch", "cloud_logging", "Log-Analytics-Workspaces"),
    "tracing": ("AWS-X-Ray", "trace", "Application-Insights"),
    "audit": ("AWS-CloudTrail", "cloud_audit_logs", "Activity-Log"),
    "iac": ("AWS-CloudFormation", None, "Templates"),
    "cost": ("AWS-Cost-Explorer", "billing", "Cost-Management-and-Billing"),
    "inventory": ("AWS-Config", "cloud_asset_inventory", "Resource-Graph-Explorer"),
    "remote-access": ("AWS-Systems-Manager", "identity-aware_proxy", "Bastions"),
    "ci": ("AWS-CodeBuild", "cloud_build", "Azure-DevOps"),
    "cd": ("AWS-CodePipeline", "cloud_deploy", "Azure-DevOps"),
    "packages": ("AWS-CodeArtifact", "artifact_registry", "Azure-DevOps"),
    "static-hosting": ("AWS-Amplify", None, "Static-Apps"),
    "iot": ("AWS-IoT-Core", None, "IoT-Hub"),
    "virtual-desktops": ("Amazon-WorkSpaces", None, "Azure-Virtual-Desktop"),
    # second wave
    "vmware": ("Amazon-Elastic-VMware-Service", "vmware_engine", "Azure-VMware-Solution"),
    "image-builder": ("Amazon-EC2-Image-Builder", None, "Image-Templates"),
    "scheduler": ("Amazon-EventBridge", "cloud_scheduler", None),
    "graphql": ("AWS-AppSync", None, "API-Management-Services"),
    "service-mesh": ("Amazon-VPC-Lattice", "anthos_service_mesh", "Kubernetes-Services"),
    "online-transfer": ("AWS-DataSync", "transfer", "Azure-Storage-Mover"),
    "sftp": ("AWS-Transfer-Family", None, "Storage-Accounts"),
    "lustre": ("Amazon-FSx-for-Lustre", None, None),
    "netapp": ("Amazon-FSx-for-NetApp-ONTAP", None, "Azure-NetApp-Files"),
    "storage-gateway": ("AWS-Storage-Gateway", None, "Storage-Sync-Services"),
    "oracle": ("Oracle-Database-at-AWS", None, "Oracle-Database"),
    "nat": ("Amazon-Virtual-Private-Cloud", "cloud_nat", "NAT"),
    "transit": ("AWS-Transit-Gateway", "network_connectivity_center", "Virtual-WANs"),
    "global-accelerator": ("AWS-Global-Accelerator", "cloud_load_balancing", "Load-Balancers"),
    "network-firewall": ("AWS-Network-Firewall", "cloud_firewall_rules", "Firewalls"),
    "dns-resolver": ("Amazon-Route-53", "cloud_dns", "DNS-Private-Resolver"),
    "rabbitmq": ("Amazon-MQ", None, None),
    "airflow": ("Amazon-Managed-Workflows-for-Apache-Airflow", "cloud_composer", None),
    "stream-delivery": ("Amazon-Data-Firehose", "pubsub", "Event-Hubs"),
    "mobile-push": ("Amazon-Simple-Notification-Service", None, "Notification-Hubs"),
    "chatbot": ("Amazon-Lex", "dialogflow_cx", "Bot-Services"),
    "nlp": ("Amazon-Comprehend", "cloud_natural_language_api", "Language"),
    "translation": ("Amazon-Translate", "cloud_translation_api", "Translator-Text"),
    "ai-coding": ("Amazon-Q", None, None),
    "public-certs": ("AWS-Certificate-Manager", "certificate_manager", "App-Service-Certificates"),
    "private-ca": ("AWS-Private-Certificate-Authority", "certificate_authority_service", None),
    "hsm": ("AWS-CloudHSM", "cloud_hsm", "Dedicated-HSM"),
    "sensitive-data": ("Amazon-Macie", "data_loss_prevention_api", None),
    "vuln-scanning": ("Amazon-Inspector", None, "Microsoft-Defender-for-Cloud"),
    "siem": ("Amazon-Security-Lake", "core:Security Operations", "Azure-Sentinel"),
    "zero-trust": ("AWS-Verified-Access", "beyondcorp", "Entra-Private-Access"),
    "managed-ad": ("AWS-Directory-Service", "managed_service_for_microsoft_active_directory", "Entra-Domain-Services"),
    "grafana": ("Amazon-Managed-Grafana", None, "Azure-Managed-Grafana"),
    "prometheus": ("Amazon-Managed-Service-for-Prometheus", "cloud_monitoring", "Monitor"),
    "patching": ("AWS-Systems-Manager", "os_patch_management", "Update-Management-Center"),
    "advisor": ("AWS-Trusted-Advisor", None, "Advisor"),
    "service-health": ("AWS-Health-Dashboard", None, "Service-Health"),
    "chaos": ("AWS-Fault-Injection-Service", None, "Azure-Chaos-Studio"),
    "migration": ("AWS-Application-Migration-Service", "migrate_for_compute_engine", "Azure-Migrate"),
    "disaster-recovery": ("AWS-Elastic-Disaster-Recovery", None, "Recovery-Services-Vaults"),
    "quotas": (None, "quotas", "Azure-Quotas"),
    "cloud-shell": ("AWS-CloudShell", "cloud_shell", "Azure-Cloud-Shell"),
    "app-config": ("AWS-AppConfig", None, "App-Configuration"),
    "device-testing": ("AWS-Device-Farm", "cloud_test_lab", None),
    "dev-environments": (None, None, "Microsoft-Dev-Box"),
    "transcoding": ("AWS-Elemental-MediaConvert", None, None),
    "maps": ("Amazon-Location-Service", "google_maps_platform", "Azure-Maps-Accounts"),
    "quantum": ("Amazon-Braket", None, None),
}


def find(pattern):
    hits = sorted(h for h in glob.glob(pattern, recursive=True) if "__MACOSX" not in h)
    if not hits:
        sys.exit(f"no icon for {pattern}")
    return hits[0]


def main(src, out="public/icons"):
    for p in ("aws", "gcp", "azure"):
        shutil.rmtree(f"{out}/{p}", ignore_errors=True)
        os.makedirs(f"{out}/{p}")
    n = 0
    for mid, (aws, gcp, azure) in ICONS.items():
        if aws:
            shutil.copy(find(f"{src}/aws/Architecture-Service-Icons_*/**/Arch_{aws}_64.svg"), f"{out}/aws/{mid}.svg"); n += 1
        if gcp:
            pat = (f"{src}/gcp-core/**/{gcp[5:]}/SVG/*.svg" if gcp.startswith("core:") else f"{src}/gcp-legacy/**/{gcp}.svg")
            shutil.copy(find(pat), f"{out}/gcp/{mid}.svg"); n += 1
        if azure:
            shutil.copy(find(f"{src}/azure/**/*-icon-service-{glob.escape(azure)}.svg"), f"{out}/azure/{mid}.svg"); n += 1
    have = {mid: [p for p, v in zip(("aws", "gcp", "azure"), names) if v] for mid, names in ICONS.items()}
    with open("src/content/icons.ts", "w") as f:
        f.write("// Generated by scripts/icons.py. Which cells have an official service icon in public/icons/<provider>/<id>.svg.\n")
        f.write("export const ICONS: Record<string, string[]> = {\n")
        for mid, ps in have.items():
            f.write(f'  "{mid}": [{", ".join(chr(34) + p + chr(34) for p in ps)}],\n')
        f.write("};\n")
    print(f"copied {n} icons")


if __name__ == "__main__":
    main(sys.argv[1])
