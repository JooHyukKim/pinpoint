/*
 * Copyright 2021 NAVER Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.navercorp.pinpoint.collector.grpc.config;

import com.navercorp.pinpoint.grpc.security.SslServerConfig;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.ResourceUtils;
import org.springframework.util.StringUtils;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Objects;

/**
 * @author Taejin Koo
 */
public class GrpcSslConfiguration {

    private final boolean enable;
    private final String providerType;
    private final File keyFile;
    private final File keyCertFile;

    private GrpcSslConfiguration(boolean enable, String providerType,
                                 File keyFile, File keyCertFile) {
        this.enable = enable;
        this.providerType = providerType;
        this.keyFile = keyFile;
        this.keyCertFile = keyCertFile;
    }

    public boolean isEnable() {
        return enable;
    }

    public String getProviderType() {
        return providerType;
    }

    public File getKeyFile() {
        return keyFile;
    }

    public File getKeyCertFile() {
        return keyCertFile;
    }

    public SslServerConfig toSslServerConfig() {
        if (enable) {
            SslServerConfig sslServerConfig = new SslServerConfig(enable, providerType, keyFile, keyCertFile);
            return sslServerConfig;
        } else {
            return SslServerConfig.DISABLED_CONFIG;
        }
    }

    public static Builder newBuilder() {
        return new Builder();
    }

    public static class Builder {

        private final Logger logger = LoggerFactory.getLogger(getClass());

        private boolean enable;
        private String providerType;
        private String keyFilePath;
        private String keyCertFilePath;

        public boolean isEnable() {
            return enable;
        }

        public void setEnable(boolean enable) {
            this.enable = enable;
        }

        public String getProviderType() {
            return providerType;
        }

        public void setProviderType(String providerType) {
            this.providerType = providerType;
        }

        public String getKeyFilePath() {
            return keyFilePath;
        }

        public void setKeyFilePath(String keyFilePath) {
            this.keyFilePath = keyFilePath;
        }

        public String getKeyCertFilePath() {
            return keyCertFilePath;
        }

        public void setKeyCertFilePath(String keyCertFilePath) {
            this.keyCertFilePath = keyCertFilePath;
        }

        public GrpcSslConfiguration build() throws IOException, URISyntaxException {
            if (enable) {
                Objects.requireNonNull(providerType);
                File keyFile = getFile(keyFilePath);
                File keyCertFile = getFile(keyCertFilePath);
                return new GrpcSslConfiguration(this.enable, this.providerType, keyFile, keyCertFile);
            } else {
                return new GrpcSslConfiguration(this.enable, this.providerType, null, null);
            }
        }

        private File getFile(String filePath) {
            if (!StringUtils.hasText(filePath)) {
                return null;
            }

            // Find file in classLoader's path
            try {
                ClassPathResource classPathResource = new ClassPathResource(filePath);
                File file = classPathResource.getFile();
                if (file.exists()) {
                    return file;
                }
            } catch (IOException e) {
            }

            // Find file in absolute path
            try {
                File file = ResourceUtils.getFile(filePath);
                if (file.exists()) {
                    return file;
                }
            } catch (FileNotFoundException e) {
            }

            logger.warn("Could not find file.(path:{}", filePath);
            return null;
        }
    }

    @Override
    public String toString() {
        return "GrpcSslConfiguration{" +
                "enable=" + enable +
                ", providerType='" + providerType + '\'' +
                ", keyFile='" + keyFile + '\'' +
                ", keyCertFile='" + keyCertFile + '\'' +
                '}';
    }
}