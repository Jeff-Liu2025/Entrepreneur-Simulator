$ProgressPreference = 'SilentlyContinue'
Add-Type -AssemblyName System.Web

$baseUrl = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image'

$assets = @(
    @{
        File = 'assets\portraits\lifeng.png'
        Size = 'square'
        Prompt = 'pixel art, 8-bit/16-bit, Stardew Valley style, Chinese male entrepreneur, English teacher temperament, lakeside startup period, wearing glasses, simple shirt, gentle but determined expression, solid light background, bust shot'
    },
    @{
        File = 'assets\portraits\chenmo.png'
        Size = 'square'
        Prompt = 'pixel art, 8-bit/16-bit, Stardew Valley style, Chinese male tech entrepreneur, wearing casual polo shirt or jeans, confident smile, hardware/mobile phone industry, solid light background, bust shot'
    },
    @{
        File = 'assets\portraits\wangqiming.png'
        Size = 'square'
        Prompt = 'pixel art, 8-bit/16-bit, Stardew Valley style, young Chinese male entrepreneur, consumer retail/social e-commerce, lively, business casual wear, solid light background, bust shot'
    },
    @{
        File = 'assets\scenes\office.png'
        Size = 'landscape_4_3'
        Prompt = 'pixel art, 8-bit/16-bit, Stardew Valley style, 1990s shabby startup office, several people crowded in an apartment, computers and desks, warm lighting'
    },
    @{
        File = 'assets\scenes\factory.png'
        Size = 'landscape_4_3'
        Prompt = 'pixel art, 8-bit/16-bit, Stardew Valley style, mobile phone/hardware factory workshop, assembly line, bright industrial lights'
    },
    @{
        File = 'assets\scenes\warehouse.png'
        Size = 'landscape_4_3'
        Prompt = 'pixel art, 8-bit/16-bit, Stardew Valley style, warehouse/farm scene, stacked goods or agricultural products, rural atmosphere'
    },
    @{
        File = 'assets\scenes\citynight.png'
        Size = 'landscape_4_3'
        Prompt = 'pixel art, 8-bit/16-bit, Stardew Valley style, city night scene, tall buildings, neon lights, bustling metropolis'
    },
    @{
        File = 'assets\scenes\meeting.png'
        Size = 'landscape_4_3'
        Prompt = 'pixel art, 8-bit/16-bit, Stardew Valley style, meeting room, long table, projection screen, serious discussion atmosphere'
    }
)

$results = @()

foreach ($item in $assets) {
    $encoded = [System.Web.HttpUtility]::UrlEncode($item.Prompt)
    $uri = "$baseUrl`?prompt=$encoded&image_size=$($item.Size)"
    $success = $false
    $lastError = ''

    for ($attempt = 1; $attempt -le 3; $attempt++) {
        try {
            Invoke-WebRequest -Uri $uri -OutFile $item.File -TimeoutSec 180 -ErrorAction Stop
            $fileInfo = Get-Item -Path $item.File -ErrorAction Stop
            if ($fileInfo.Length -gt 0) {
                $success = $true
                break
            } else {
                $lastError = 'downloaded file is 0 bytes'
                Write-Host "$($item.File) attempt $attempt`: empty file"
            }
        } catch {
            $lastError = $_.Exception.Message
            Write-Host "$($item.File) attempt $attempt failed`: $lastError"
        }
        Start-Sleep -Seconds 2
    }

    $fileSize = if (Test-Path $item.File) { (Get-Item $item.File).Length } else { 0 }
    $results += [pscustomobject]@{
        File   = $item.File
        Size   = $fileSize
        Status = if ($success -and $fileSize -gt 0) { 'SUCCESS' } else { "FAILED`: $lastError" }
    }
}

Write-Host "`n--- Download Summary ---"
$results | Format-Table -AutoSize

# Return non-zero exit code if any download failed
$failed = $results | Where-Object { $_.Status -ne 'SUCCESS' }
if ($failed) { exit 1 }
