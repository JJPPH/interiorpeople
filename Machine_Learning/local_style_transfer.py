# -*- coding: utf-8 -*-
import PIL
from PIL import Image
import numpy as np
import os
import argparse
import torch
import torch.nn as nn
import cv2

from torchvision import transforms
from torchvision.utils import save_image

from PIL import Image
from IPython.display import Image as display_image


parser = argparse.ArgumentParser(description='Arguments')

parser.add_argument('--image_path', required=True, help = 'fg image path')
parser.add_argument('--targets', required=True, help = 'list of target objects for style transfer')
parser.add_argument('--vgg_path', required=True, help = 'vgg path')
parser.add_argument('--decoder_path', required=True, help = 'decoder path')
parser.add_argument('--content_image', required=True, help = 'content image path')
parser.add_argument('--style_image', required=True, help = 'style image path')
parser.add_argument('--output_style_path', required=True, help = 'output image path')
parser.add_argument('--style_intensity', required=False, default = 'Middle', help='Style Image intensity; High, Middle, Low')
parser.add_argument('--fg_image_path', required=True, help = 'fg image path')
parser.add_argument('--bg_image_path', required=True, help = 'bg image path')
parser.add_argument('--stylized_image_path', required=True, help = 'stylized image path')
parser.add_argument('--output_local_style_path', required=True, help = 'output image path')


args = parser.parse_args()

image_path = args.image_path
targets = args.targets.split(', ')

class Net(nn.Module):
    def __init__(self, encoder, decoder):
        super(Net, self).__init__()
        enc_layers = list(encoder.children())
        self.enc_1 = nn.Sequential(*enc_layers[:4]) # input -> relu1_1
        self.enc_2 = nn.Sequential(*enc_layers[4:11]) # relu1_1 -> relu2_1
        self.enc_3 = nn.Sequential(*enc_layers[11:18]) # relu2_1 -> relu3_1
        self.enc_4 = nn.Sequential(*enc_layers[18:31]) # relu3_1 -> relu4_1
        self.decoder = decoder
        self.mse_loss = nn.MSELoss()

        # fix the encoder
        for name in ['enc_1', 'enc_2', 'enc_3', 'enc_4']:
            for param in getattr(self, name).parameters():
                param.requires_grad = False

    # extract relu1_1, relu2_1, relu3_1, relu4_1 from input image (중간 결과를 기록)
    def encode_with_intermediate(self, input):
        results = [input]
        for i in range(4):
            func = getattr(self, 'enc_{:d}'.format(i + 1))
            results.append(func(results[-1]))
        return results[1:]

    # extract relu4_1 from input image (최종 결과만 기록)
    def encode(self, input):
        for i in range(4):
            input = getattr(self, 'enc_{:d}'.format(i + 1))(input)
        return input

    # 콘텐츠 손실(feature 값 자체가 유사해지도록)
    def calc_content_loss(self, input, target):
        assert (input.size() == target.size())
        assert (target.requires_grad is False)
        return self.mse_loss(input, target)

    # 스타일 손실(feature의 statistics가 유사해지도록)
    def calc_style_loss(self, input, target):
        assert (input.size() == target.size())
        assert (target.requires_grad is False)
        input_mean, input_std = calc_mean_std(input)
        target_mean, target_std = calc_mean_std(target)
        return self.mse_loss(input_mean, target_mean) + self.mse_loss(input_std, target_std)

    def forward(self, content, style, alpha=1.0):
        # 콘텐츠와 스타일 중 어떤 것에 더 많은 가중치를 둘지 설정 가능
        assert 0 <= alpha <= 1 # 0에 가까울수록 콘텐츠를 많이 살림
        style_feats = self.encode_with_intermediate(style)
        content_feat = self.encode(content)
        t = adain(content_feat, style_feats[-1])
        t = alpha * t + (1 - alpha) * content_feat

        g_t = self.decoder(t) # 결과 이미지
        g_t_feats = self.encode_with_intermediate(g_t)

        # 콘텐츠 손실과 스타일 손실을 줄이기 위해 두 개의 손실 값 반환
        loss_c = self.calc_content_loss(g_t_feats[-1], t)
        loss_s = self.calc_style_loss(g_t_feats[0], style_feats[0])
        for i in range(1, 4):
            loss_s += self.calc_style_loss(g_t_feats[i], style_feats[i])
        return loss_c, loss_s

def run():
    # ======== merge_fg_bg.py ======== #
    def merge_bg_fg(targets):
    # ======== merge_bg ========= #
      images = os.listdir(image_path) # image files in image path(ex : bg_tv1.jpg)
      target_images = []
      for image in images:
        if image[0:2]=='bg': # check if bg image
          label = image[3:-4] # (ex : tv1, tv2,,,)
          if label in targets : # put every target images into target_images list
            target_images.append(image)

      result = np.array(PIL.Image.open(image_path + target_images[0])) # set result image as first target image
      if len(target_images)>1: # if multiple labels are selected, merge them
        for i in range(1, len(target_images)):
          img = image_path+target_images[i] # (ex : ./bg_tv1.jpg)
          img = PIL.Image.open(img) # open as PIL image
          img = np.array(img) # use as numpy array
          result = np.where((img!=result)&(img<=result), img, result) # merge bg_image
      result_img = PIL.Image.fromarray(result, 'RGB') # numpy to image
      result_img.save(image_path+"bg_result.jpg") # save image

    # ======== merge_fg ========= #
      images = os.listdir(image_path) # image files in image path(ex : fg_tv1.jpg)
      target_images = []
      for image in images:
        if image[0:2]=='fg': # check if fg image
          label = image[3:-4] # (ex : tv1, tv2,,,)
          if label in targets : # put every target images into target_images list
            target_images.append(image)

      result = np.array(PIL.Image.open(image_path + target_images[0])) # set result image as first target image
      if len(target_images)>1: # if multiple labels are selected, merge them
        for i in range(1, len(target_images)):
          img = image_path+target_images[i] # (ex : ./bg_tv1.jpg)
          img = PIL.Image.open(img) # open as PIL image
          img = np.array(img) # use as numpy array
          result = np.where((img!=result)&(img>=result), img, result) # merge fg_image
      result_img = PIL.Image.fromarray(result, 'L') # numpy to image
      result_img.save(image_path+"fg_result.jpg") # save image

    # 사용자가 여러 개의 object를 선택한 경우
    if len(targets)>=2:
      merge_bg_fg(targets) # merge bg of targets
    # 사용자가 하나의 object를 선택한 경우
    else:
      fg = image_path+'fg_'+targets[0]+'.jpg'
      fg = PIL.Image.open(fg)
      fg.save(image_path+'fg_result.jpg')

      bg = image_path+'bg_'+targets[0]+'.jpg'
      bg = PIL.Image.open(bg)
      bg.save(image_path+'bg_result.jpg')

    """(Python)AdaIN_Style_Transfer_Tutorial.ipynb

    Automatically generated by Colaboratory.

    Original file is located at
        https://colab.research.google.com/drive/1nghI3i0DvBm_IpdXfdjQd_PpkUNvEu3F

    <a href="https://colab.research.google.com/github/ndb796/Deep-Learning-Paper-Review-and-Practice/blob/master/code_practices/AdaIN_Style_Transfer_Tutorial.ipynb" target="_parent"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/></a>
    """
    # ========== style_transfer.py ============ #
    def calc_mean_std(feat, eps=1e-5):
        size = feat.size()
        assert (len(size) == 4)
        N, C = size[:2]
        feat_var = feat.view(N, C, -1).var(dim=2) + eps
        feat_std = feat_var.sqrt().view(N, C, 1, 1)
        feat_mean = feat.view(N, C, -1).mean(dim=2).view(N, C, 1, 1)
        return feat_mean, feat_std

    def adaptive_instance_normalization(content_feat, style_feat):
        assert (content_feat.size()[:2] == style_feat.size()[:2])
        size = content_feat.size()
        style_mean, style_std = calc_mean_std(style_feat)
        content_mean, content_std = calc_mean_std(content_feat)

        # 평균(mean)과 표준편차(std)를 이용하여 정규화 수행
        normalized_feat = (content_feat - content_mean.expand(size)) / content_std.expand(size)
        # 정규화 이후에 style feature의 statistics를 가지도록 설정
        return normalized_feat * style_std.expand(size) + style_mean.expand(size)

    # 인코더(Encoder) 정의
    vgg = nn.Sequential(
        nn.Conv2d(3, 3, (1, 1)),
        nn.ReflectionPad2d((1, 1, 1, 1)),
        nn.Conv2d(3, 64, (3, 3)),
        nn.ReLU(), # relu1-1
        nn.ReflectionPad2d((1, 1, 1, 1)),
        nn.Conv2d(64, 64, (3, 3)),
        nn.ReLU(), # relu1-2
        nn.MaxPool2d((2, 2), (2, 2), (0, 0), ceil_mode=True),
        nn.ReflectionPad2d((1, 1, 1, 1)),
        nn.Conv2d(64, 128, (3, 3)),
        nn.ReLU(), # relu2-1
        nn.ReflectionPad2d((1, 1, 1, 1)),
        nn.Conv2d(128, 128, (3, 3)),
        nn.ReLU(), # relu2-2
        nn.MaxPool2d((2, 2), (2, 2), (0, 0), ceil_mode=True),
        nn.ReflectionPad2d((1, 1, 1, 1)),
        nn.Conv2d(128, 256, (3, 3)),
        nn.ReLU(), # relu3-1
        nn.ReflectionPad2d((1, 1, 1, 1)),
        nn.Conv2d(256, 256, (3, 3)),
        nn.ReLU(), # relu3-2
        nn.ReflectionPad2d((1, 1, 1, 1)),
        nn.Conv2d(256, 256, (3, 3)),
        nn.ReLU(), # relu3-3
        nn.ReflectionPad2d((1, 1, 1, 1)),
        nn.Conv2d(256, 256, (3, 3)),
        nn.ReLU(), # relu3-4
        nn.MaxPool2d((2, 2), (2, 2), (0, 0), ceil_mode=True),
        nn.ReflectionPad2d((1, 1, 1, 1)),
        nn.Conv2d(256, 512, (3, 3)),
        nn.ReLU(), # relu4-1, this is the last layer used
        nn.ReflectionPad2d((1, 1, 1, 1)),
        nn.Conv2d(512, 512, (3, 3)),
        nn.ReLU(), # relu4-2
        nn.ReflectionPad2d((1, 1, 1, 1)),
        nn.Conv2d(512, 512, (3, 3)),
        nn.ReLU(), # relu4-3
        nn.ReflectionPad2d((1, 1, 1, 1)),
        nn.Conv2d(512, 512, (3, 3)),
        nn.ReLU(), # relu4-4
        nn.MaxPool2d((2, 2), (2, 2), (0, 0), ceil_mode=True),
        nn.ReflectionPad2d((1, 1, 1, 1)),
        nn.Conv2d(512, 512, (3, 3)),
        nn.ReLU(), # relu5-1
        nn.ReflectionPad2d((1, 1, 1, 1)),
        nn.Conv2d(512, 512, (3, 3)),
        nn.ReLU(), # relu5-2
        nn.ReflectionPad2d((1, 1, 1, 1)),
        nn.Conv2d(512, 512, (3, 3)),
        nn.ReLU(), # relu5-3
        nn.ReflectionPad2d((1, 1, 1, 1)),
        nn.Conv2d(512, 512, (3, 3)),
        nn.ReLU() # relu5-4
    )

    # 디코더(Decoder) 정의
    decoder = nn.Sequential(
        nn.ReflectionPad2d((1, 1, 1, 1)),
        nn.Conv2d(512, 256, (3, 3)),
        nn.ReLU(),
        nn.Upsample(scale_factor=2, mode='nearest'),
        nn.ReflectionPad2d((1, 1, 1, 1)),
        nn.Conv2d(256, 256, (3, 3)),
        nn.ReLU(),
        nn.ReflectionPad2d((1, 1, 1, 1)),
        nn.Conv2d(256, 256, (3, 3)),
        nn.ReLU(),
        nn.ReflectionPad2d((1, 1, 1, 1)),
        nn.Conv2d(256, 256, (3, 3)),
        nn.ReLU(),
        nn.ReflectionPad2d((1, 1, 1, 1)),
        nn.Conv2d(256, 128, (3, 3)),
        nn.ReLU(),
        nn.Upsample(scale_factor=2, mode='nearest'),
        nn.ReflectionPad2d((1, 1, 1, 1)),
        nn.Conv2d(128, 128, (3, 3)),
        nn.ReLU(),
        nn.ReflectionPad2d((1, 1, 1, 1)),
        nn.Conv2d(128, 64, (3, 3)),
        nn.ReLU(),
        nn.Upsample(scale_factor=2, mode='nearest'),
        nn.ReflectionPad2d((1, 1, 1, 1)),
        nn.Conv2d(64, 64, (3, 3)),
        nn.ReLU(),
        nn.ReflectionPad2d((1, 1, 1, 1)),
        nn.Conv2d(64, 3, (3, 3)),
    )

    decoder.eval()
    vgg.eval()

    vgg_path = args.vgg_path
    decoder_path = args.decoder_path

    decoder.load_state_dict(torch.load(decoder_path))
    vgg.load_state_dict(torch.load(vgg_path))

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    vgg.to(device)
    decoder.to(device)

    vgg = nn.Sequential(*list(vgg.children())[:31]) # ReLU4_1까지만 사용
    '''
    class Net(nn.Module):
        def __init__(self, encoder, decoder):
            super(Net, self).__init__()
            enc_layers = list(encoder.children())
            self.enc_1 = nn.Sequential(*enc_layers[:4]) # input -> relu1_1
            self.enc_2 = nn.Sequential(*enc_layers[4:11]) # relu1_1 -> relu2_1
            self.enc_3 = nn.Sequential(*enc_layers[11:18]) # relu2_1 -> relu3_1
            self.enc_4 = nn.Sequential(*enc_layers[18:31]) # relu3_1 -> relu4_1
            self.decoder = decoder
            self.mse_loss = nn.MSELoss()

            # fix the encoder
            for name in ['enc_1', 'enc_2', 'enc_3', 'enc_4']:
                for param in getattr(self, name).parameters():
                    param.requires_grad = False

        # extract relu1_1, relu2_1, relu3_1, relu4_1 from input image (중간 결과를 기록)
        def encode_with_intermediate(self, input):
            results = [input]
            for i in range(4):
                func = getattr(self, 'enc_{:d}'.format(i + 1))
                results.append(func(results[-1]))
            return results[1:]

        # extract relu4_1 from input image (최종 결과만 기록)
        def encode(self, input):
            for i in range(4):
                input = getattr(self, 'enc_{:d}'.format(i + 1))(input)
            return input

        # 콘텐츠 손실(feature 값 자체가 유사해지도록)
        def calc_content_loss(self, input, target):
            assert (input.size() == target.size())
            assert (target.requires_grad is False)
            return self.mse_loss(input, target)

        # 스타일 손실(feature의 statistics가 유사해지도록)
        def calc_style_loss(self, input, target):
            assert (input.size() == target.size())
            assert (target.requires_grad is False)
            input_mean, input_std = calc_mean_std(input)
            target_mean, target_std = calc_mean_std(target)
            return self.mse_loss(input_mean, target_mean) + self.mse_loss(input_std, target_std)

        def forward(self, content, style, alpha=1.0):
            # 콘텐츠와 스타일 중 어떤 것에 더 많은 가중치를 둘지 설정 가능
            assert 0 <= alpha <= 1 # 0에 가까울수록 콘텐츠를 많이 살림
            style_feats = self.encode_with_intermediate(style)
            content_feat = self.encode(content)
            t = adain(content_feat, style_feats[-1])
            t = alpha * t + (1 - alpha) * content_feat

            g_t = self.decoder(t) # 결과 이미지
            g_t_feats = self.encode_with_intermediate(g_t)

            # 콘텐츠 손실과 스타일 손실을 줄이기 위해 두 개의 손실 값 반환
            loss_c = self.calc_content_loss(g_t_feats[-1], t)
            loss_s = self.calc_style_loss(g_t_feats[0], style_feats[0])
            for i in range(1, 4):
                loss_s += self.calc_style_loss(g_t_feats[i], style_feats[i])
            return loss_c, loss_s
    '''
    def style_transfer(vgg, decoder, content, style, alpha=1.0):
        assert (0.0 <= alpha <= 1.0)
        content_f = vgg(content)
        try:
            style_f = vgg(style)
        except:
            print('3 channel 이미지를 넣어주세요')
            
        style_f = vgg(style)
        feat = adaptive_instance_normalization(content_f, style_f)
        feat = feat * alpha + content_f * (1 - alpha)
        return decoder(feat)

    def test_transform(size=512):
        transform_list = []
        if size != 0:
            transform_list.append(transforms.Resize(size))
        transform_list.append(transforms.ToTensor())
        transform = transforms.Compose(transform_list)
        return transform
    
    content_tf = test_transform()
    style_tf = test_transform()

    content_path = args.content_image
    style_path = args.style_image

    content = content_tf(Image.open(str(content_path)))
    style = style_tf(Image.open(str(style_path)))

    style = style.to(device).unsqueeze(0)
    content = content.to(device).unsqueeze(0)
    alpha = args.style_intensity
    if alpha == 'High':
      alpha=0.9
    elif alpha == 'Middle':
      alpha=0.6
    elif alpha == 'Low':
      alpha=0.3

    with torch.no_grad():
        output = style_transfer(vgg, decoder, content, style, alpha=alpha) # lower alpha -> more contents
    output = output.cpu()

    save_image(output, args.output_style_path)

    # check if stylized image shape is not same with fg_image
    fg_image = Image.open(args.fg_image_path)
    fg_image = np.array(fg_image)
    if output.shape != fg_image.shape:
      img = cv2.imread(args.output_style_path)
      res = cv2.resize(img, dsize=(fg_image.shape[1], fg_image.shape[0]), interpolation=cv2.INTER_CUBIC)
      cv2.imwrite(args.output_style_path, res)
    
    # ====== local_style_transfer.py ======== #
    fg_image_path = args.fg_image_path
    bg_image_path = args.bg_image_path
    stylized_image_path = args.stylized_image_path
    output_path = args.output_local_style_path

    fg_image = Image.open(fg_image_path)
    fg_image = np.array(fg_image)
    fg_image = np.stack((fg_image,)*3, axis=-1)
    bg_image = Image.open(bg_image_path)
    bg_image = np.array(bg_image)
    stylized_image = Image.open(stylized_image_path)
    stylized_image = np.array(stylized_image)

    fg_styled_image = stylized_image*(fg_image>=stylized_image)
    local_styled_image = fg_styled_image + bg_image

    local_styled_image = Image.fromarray(local_styled_image, 'RGB')
    local_styled_image.save(output_path)

    
run()
