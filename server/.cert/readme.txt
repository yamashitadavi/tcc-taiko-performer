Como gerar o certificado para localhost (requerimento para não quebrar a aplicação em sandbox)

https://stackoverflow.com/questions/60030906/self-signed-certificate-only-works-with-localhost-not-127-0-0-1

Instalar o openssl (exe obtido do slproweb)

Criar um documento req.cnf com a configuração abaixo (até o fim do ip) e incluir na pasta do openssl/bin
(substituir o IP 192.168.18.5 pelo seu)
(para funcionar em teste mobile não precisaria do certificado, mas é necesário configurar no package.json --host 127.0.0.1 com o seu ipv4 e também em index.ts)

[req]
distinguished_name = req_distinguished_name
x509_extensions = v3_req
prompt = no
[req_distinguished_name]
C = BR
ST = Paraná
L = Londrina
O = MyCompany
OU = MyDivision
CN = localhost
[v3_req]
keyUsage = critical, digitalSignature, keyAgreement
extendedKeyUsage = serverAuth
subjectAltName = DNS:localhost,IP:192.168.18.5,IP:127.0.0.1


abrir o cmd como admin na pasta bin do diretório do mesmo e executar o comando:
openssl req -newkey rsa:2048 -x509 -nodes -keyout key.pem -new -out cert.pem -config req.cnf -sha256 -days 365

criar uma cópia do cert.pem e renomear para cert.crt e instalar o certificado na "máquina local" e incluir como permissão na "raíz confiável"
