# PixelPerfect PPT

Export your Figma Slides and Figma Design to PowerPoint presentations with pixel-perfect image quality.

## Overview

PixelPerfect PPT is a simple utility tool for Figma. It works with both Figma Slides and Figma Design, converting your designs into PowerPoint presentations using high-quality bitmap images. Slide dimensions can be automatically configured or manually set with resize modes, preserving every detail exactly as you designed it.

## Key Features

### High-Fidelity Export

Uses Figma's native export to generate high-quality bitmap images. Your designs are exported as pixel-perfect images in PowerPoint slides, preserving all visual details including gradients, shadows, and complex graphics.

### Flexible Export Options

- **Export All Slides**: Exports all slides, excluding skipped slides by default
- **Export Selected Slides**: Choose specific slides to export

### Quality Control

Choose from multiple export quality levels:

- 1x (Standard)
- 1.5x (Balanced)
- 2x (High) - Recommended
- 3x (Ultra High)
- 4x (Maximum)

### Slide Dimensions

Configure slide dimensions automatically or manually. When using custom dimensions, choose from four resize modes to control how images are adjusted. In Figma Design, you can also set resize modes when using original dimensions:

- **Fit**: Scale the image to fit within the specified dimensions while maintaining aspect ratio
- **Fill**: Scale and crop the image to fill the specified dimensions while maintaining aspect ratio
- **Stretch**: Stretch the image to exactly match the specified dimensions (may distort aspect ratio)
- **Original**: Keep the original image size regardless of custom dimensions

### Result Preview

Navigate and preview multiple slides or frames using pagination controls before exporting. The preview updates live when you adjust dimensions or resize modes, helping you get the perfect result.

### Export Progress & Cancellation

- Real-time progress tracking shows which slide is being exported
- Cancel export at any time - the export will stop after the current slide finishes processing

### Automatic Sorting

Slides are automatically sorted by page numbers in their names, ensuring correct order.

## How to Use

1. Open your Figma Slides file or Figma Design
2. Launch the PixelPerfect PPT plugin
3. Choose export mode:
   - "All slides" to export everything (skipped slides excluded)
   - Select slides or frames and choose "Selected slides"
4. Set quality level
5. Configure slide dimensions:
   - "Original" to use the original slide dimensions (slide dimensions will be automatically configured; in Figma Design, you can also set resize modes)
   - "Custom" to set custom width and height, then select a resize mode (Fit, Fill, Stretch, or Original)
6. Use pagination controls to navigate and preview different pages in real-time as you adjust settings
7. Customize filename if needed
8. Click "Export to PPTX"
9. Monitor progress in real-time and cancel if needed

## Why Use This Tool?

When you need to share Figma Slides or Figma Design in PowerPoint, maintaining visual fidelity matters. This tool ensures your designs look exactly the same in PowerPoint as in Figma, without quality loss. Slide dimensions can be automatically configured or manually set with resize modes for optimal presentation.

Perfect for designers and teams who need to present Figma work in PowerPoint while keeping high visual quality.

## Technical Details

- Supports both Figma Slides and Figma Design
- Uses Figma's native export API
- Generates standard PPTX files compatible with PowerPoint, Google Slides, and other presentation software
- Each slide exported as high-resolution PNG embedded in PowerPoint
- Slide dimensions can be automatically configured or manually set
- Custom slide dimensions with four resize modes: Fit, Fill, Stretch, and Original
- Pagination controls for navigating and previewing multiple pages
- Real-time preview of export results before exporting
- Real-time export progress tracking
- Export cancellation support
- Runs entirely locally with no network access, ensuring your data stays private

## Requirements

- Figma Slides file or Figma Design
- Figma desktop app or browser

---

# PixelPerfect PPT

将你的 Figma Slides 和 Figma Design 导出为 PowerPoint 演示文稿，实现像素级完美还原。

## 概述

PixelPerfect PPT 是一个适用于 Figma 的实用小工具。它同时支持 Figma Slides 和 Figma Design，使用高质量位图将你的设计转换为 PowerPoint 演示文稿。幻灯片尺寸既能自动设置，也能手动配置，同时支持设置填充模式，确保每个细节都能完美还原。

## 核心功能

### 高保真导出

使用 Figma 原生导出功能生成高质量位图。你的设计以像素级完美的图像形式嵌入 PowerPoint 幻灯片，保留所有视觉细节，包括渐变、阴影和复杂图形。

### 灵活的导出选项

- **导出全部幻灯片**：导出所有幻灯片，默认排除已跳过的幻灯片
- **导出选中幻灯片**：选择特定幻灯片进行导出

### 质量控制

多种导出质量等级可选：

- 1x（标准）
- 1.5x（平衡）
- 2x（高清）- 推荐
- 3x（超高清）
- 4x（极致）

### 幻灯片尺寸

自动或手动配置幻灯片尺寸。使用自定义尺寸时，选择四种调整大小模式来控制图片的调整方式。在 Figma Design 模式下，使用原始尺寸时也可以设置调整模式：

- **Fit（适应）**：按比例缩放图片以适应指定尺寸
- **Fill（填充）**：按比例缩放并裁剪图片以填充指定尺寸
- **Stretch（拉伸）**：拉伸图片以完全匹配指定尺寸（可能会扭曲宽高比）
- **Original（原始）**：无论自定义尺寸如何，都保持原始图片尺寸

### 结果预览

使用分页控件在导出前导航和预览多个幻灯片或 frame。当你调整尺寸或调整大小模式时，预览会实时更新，帮助你获得完美的结果。

### 导出进度与取消

- 实时进度跟踪显示正在导出的幻灯片
- 随时取消导出 - 导出将在当前幻灯片处理完成后停止

### 自动排序

幻灯片会根据名称中的页码自动排序，确保正确顺序。

## 使用方法

1. 打开你的 Figma Slides 文件或 Figma Design
2. 启动 PixelPerfect PPT 插件
3. 选择导出模式：
   - "All slides"导出所有内容（已跳过的幻灯片会被排除）
   - 选择幻灯片或 frame 并选择"Selected slides"
4. 设置质量等级
5. 配置幻灯片尺寸：
   - "Original"使用原始幻灯片尺寸（幻灯片尺寸将自动配置；在 Figma Design 模式下也可以设置调整模式）
   - "Custom"设置自定义宽度和高度，然后选择调整大小模式（Fit、Fill、Stretch 或 Original）
6. 使用分页控件导航和预览不同页面，调整设置时实时查看结果
7. 如需要，自定义文件名
8. 点击"Export to PPTX"
9. 实时监控进度，需要时可取消导出

## 为什么使用这个工具？

当你需要在 PowerPoint 中分享 Figma Slides 或 Figma Design 时，保持视觉保真度很重要。这个工具确保你的设计在 PowerPoint 中看起来与在 Figma 中完全一致，不会丢失质量。幻灯片尺寸既能自动设置，也能手动配置，同时支持设置填充模式以获得最佳演示效果。

非常适合需要在 PowerPoint 中展示 Figma 作品，同时保持高质量视觉效果的设计师和团队。

## 技术细节

- 同时支持 Figma Slides 和 Figma Design
- 使用 Figma 原生导出 API
- 生成与 PowerPoint、Google Slides 和其他演示软件兼容的标准 PPTX 文件
- 每个幻灯片作为高分辨率 PNG 图像嵌入 PowerPoint
- 幻灯片尺寸既能自动设置，也能手动配置
- 自定义幻灯片尺寸，提供四种调整大小模式：Fit、Fill、Stretch 和 Original
- 分页控件支持导航和预览多个页面
- 导出前实时预览结果
- 实时导出进度跟踪
- 支持取消导出
- 完全本地运行，不访问任何网络资源，确保你的数据隐私安全

## 系统要求

- Figma Slides 文件或 Figma Design
- Figma 桌面应用或浏览器
