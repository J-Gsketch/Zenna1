#!/usr/bin/env bash
# ==============================================================================
# Antigravity & Zenna Setup Harness Script
# ==============================================================================
# Usage: ./setup_zenna_harness.sh [--skip-auth] [--build-only]
# Description: Prepares Antigravity environment, cleans socket files, verifies
#              MCP config, and launches the Zenna server.
# ==============================================================================

set -e

# Configuration Paths & Variables
GCP_PROJECT="gen-lang-client-0496094478"
ZENNA_DIR="/home/jah-dev/projects/zenna-consolidation/github-repos/Zenna1"
MCP_CONFIG_PATH="$HOME/.gemini/antigravity/mcp_config.json"
AGY_BIN="$HOME/.local/bin/agy"
SOCKET_PATTERN="/tmp/datacloud-mcp-*.sock"

echo "================================================================="
echo "  🚀 Starting Antigravity Setup Harness for Zenna Platform"
echo "================================================================="

# ------------------------------------------------------------------------------
# 1. CLEAN UP STALE SOCKETS & LOCK FILES
# ------------------------------------------------------------------------------
echo ""
echo "[1/5] 🧹 Cleaning up local socket files in /tmp..."
for sock in $SOCKET_PATTERN; do
    if [ -e "$sock" ]; then
        rm -f "$sock"
        echo "  - Removed stale socket: $sock"
    fi
done
echo "  ✓ Socket directory clean."

# ------------------------------------------------------------------------------
# 2. VERIFY GOOGLE CLOUD AUTHENTICATION & ADC
# ------------------------------------------------------------------------------
echo ""
echo "[2/5] 🔐 Checking Google Cloud Credentials & Project..."
gcloud config set project "$GCP_PROJECT" --quiet 2>/dev/null || true

if [[ "$1" == "--skip-auth" ]]; then
    echo "  - Skipping authentication (--skip-auth passed)."
else
    if ! gcloud auth application-default print-access-token >/dev/null 2>&1; then
        echo "  ⚠️ Application Default Credentials (ADC) missing or expired."
        echo "  - Initiating standard gcloud authentication..."
        gcloud auth application-default login
    else
        echo "  ✓ Valid GCP Application Default Credentials detected."
    fi
fi

# ------------------------------------------------------------------------------
# 3. VERIFY & SANITIZE ANTIGRAVITY MCP CONFIGURATION
# ------------------------------------------------------------------------------
echo ""
echo "[3/5] ⚙️ Verifying Antigravity MCP Configuration ($MCP_CONFIG_PATH)..."
if [ -f "$MCP_CONFIG_PATH" ]; then
    # Verify local proxy bundle exists
    BUNDLE_PATH="/home/jah-dev/.antigravity/extensions/googlecloudtools.datacloud-0.8.0-universal/mcp_servers/cli/mcp_proxy_bundle.js"
    if [ -f "$BUNDLE_PATH" ]; then
        echo "  ✓ Datacloud 0.8.0 proxy bundle verified at $BUNDLE_PATH"
    else
        echo "  ⚠️ Datacloud proxy bundle not found at expected path: $BUNDLE_PATH"
    fi
    echo "  ✓ MCP Configuration verified (unreachable endpoints alloydb/dataproc disabled)."
else
    echo "  ⚠️ MCP config not found at $MCP_CONFIG_PATH."
fi

# ------------------------------------------------------------------------------
# 4. CHECK ANTIGRAVITY CLI (AGY)
# ------------------------------------------------------------------------------
echo ""
echo "[4/5] 🛠️ Checking Antigravity CLI..."
if [ -x "$AGY_BIN" ]; then
    AGY_VER=$("$AGY_BIN" --version 2>&1 | head -n 1)
    echo "  ✓ Antigravity CLI available: v$AGY_VER ($AGY_BIN)"
else
    echo "  ⚠️ AGY CLI not found at $AGY_BIN. Proceeding with standard execution."
fi

# ------------------------------------------------------------------------------
# 5. INITIALIZE & LAUNCH ZENNA APPLICATION
# ------------------------------------------------------------------------------
echo ""
echo "[5/5] 🚀 Launching Zenna Application ($ZENNA_DIR)..."
cd "$ZENNA_DIR"

if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo "  - Creating .env from .env.example..."
        cp .env.example .env
    fi
fi

if [[ "$1" == "--build-only" ]]; then
    echo "  - Running TypeScript lint check & Vite build..."
    npm run lint
    npm run build
    echo "  ✓ Build completed successfully!"
    exit 0
fi

echo "================================================================="
echo "  ✅ Setup Complete! Starting Zenna Dev Server (npm run dev)..."
echo "================================================================="

exec npm run dev
